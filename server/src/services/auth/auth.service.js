import bcrypt from "bcryptjs";
import prisma from "../../config/db.js";

export const signupService = async ({
  email,
  password,
  role,
}) => {

  // check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  return user;
};

export const loginService = async ({
  email,
  password,
}) => {

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
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};