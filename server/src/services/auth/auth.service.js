import bcrypt from "bcryptjs";
import prisma from "../../config/db.js";
import { createLedgerAccountService } from "../ledger/ledger.service.js";
import { sendOtpEmail } from "../email/email.service.js";

export const sendOtpService = async ({ email }) => {
  // 1. Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // 2. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 3. Generate a secure 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  // 4. Save/Upsert OTP verification record
  await prisma.otpVerification.upsert({
    where: { email },
    update: {
      otp,
      expiry,
      verified: false,
    },
    create: {
      email,
      otp,
      expiry,
      verified: false,
    },
  });

  // 5. Send verification code via email
  await sendOtpEmail(email, otp);

  return { success: true, message: "Verification OTP code sent to your email." };
};

export const verifyOtpService = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and OTP are required");
  }

  // 1. Fetch OTP record
  const record = await prisma.otpVerification.findUnique({
    where: { email },
  });

  if (!record) {
    throw new Error("No verification code found for this email. Please request a new one.");
  }

  // 2. Check expiry
  if (new Date() > new Date(record.expiry)) {
    throw new Error("Verification code has expired. Please request a new code.");
  }

  // 3. Match OTP
  if (record.otp !== otp) {
    throw new Error("Incorrect verification code. Please try again.");
  }

  // 4. Mark verified
  await prisma.otpVerification.update({
    where: { email },
    data: {
      verified: true,
    },
  });

  return { success: true, message: "Email verified successfully. You can now complete registration." };
};

export const signupService = async ({ email, password, role, fullName }) => {
  // 1. Enforce OTP verification was completed
  const verification = await prisma.otpVerification.findUnique({
    where: { email },
  });

  if (!verification || !verification.verified) {
    throw new Error("Email verification required. Please verify your email via OTP first.");
  }

  // 2. General validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  if (!role || !["CLIENT", "FREELANCER", "BOTH"].includes(role)) {
    throw new Error("Invalid account role provided");
  }

  // 3. Check existing user (in case database changed between OTP and Signup)
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 5. Create user as verified atomically
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
      isVerified: true,
      profile: {
        create: {
          fullName: fullName || null,
        }
      }
    },
  });

  await createLedgerAccountService(user.id);

  // 6. Cleanup verification record
  await prisma.otpVerification.delete({
    where: { email },
  }).catch(err => console.error(`[OTP Cleanup Error] ${err.message}`));

  return user;
};

export const loginService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // enforce email verification (signup creates user with isVerified = true)
  if (!user.isVerified) {
    throw new Error("Please verify your email before logging in.");
  }

  return user;
};
