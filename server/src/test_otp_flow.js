import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000/api';

async function testOtpFlow() {
  const testEmail = `testotp_${Date.now()}@test.com`;
  const testPassword = 'SecurePassword123!';
  const testRole = 'FREELANCER';
  const testName = 'Test OTP Verification User';

  console.log(`[Test] 1. Triggering OTP generation for ${testEmail}...`);
  try {
    const res = await fetch(`${API_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    const data = await res.json();
    console.log(`[Test] Send-OTP Status: ${res.status}`, data);

    if (res.status === 200 && data.success) {
      console.log('✔ OTP request successfully received.');
    } else {
      console.error('❌ Send OTP failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Send OTP failed with error:', err.message);
    process.exit(1);
  }

  console.log(`[Test] 2. Querying DB for generated OTP...`);
  const record = await prisma.otpVerification.findUnique({
    where: { email: testEmail }
  });

  if (record && record.otp && !record.verified) {
    console.log(`✔ Found verification record. OTP generated: ${record.otp}`);
  } else {
    console.error('❌ Could not find OTP verification record in DB.');
    process.exit(1);
  }

  console.log(`[Test] 3. Testing signup blocking before verification...`);
  try {
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        role: testRole,
        fullName: testName
      })
    });
    const signupData = await signupRes.json();
    console.log(`[Test] Pre-verification Signup Status: ${signupRes.status}`, signupData);

    if (signupRes.status === 400 && !signupData.success && signupData.message.includes("Email verification required")) {
      console.log('✔ Signup blocking verified.');
    } else {
      console.error('❌ Signup was not blocked as expected.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Pre-verification signup failed with error:', err.message);
    process.exit(1);
  }

  console.log(`[Test] 4. Verifying OTP with an incorrect code...`);
  try {
    const verifyRes = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: '000000'
      })
    });
    const verifyData = await verifyRes.json();
    console.log(`[Test] Incorrect OTP Verify Status: ${verifyRes.status}`, verifyData);

    if (verifyRes.status === 400 && !verifyData.success) {
      console.log('✔ Incorrect OTP validation rejected as expected.');
    } else {
      console.error('❌ Incorrect OTP was accepted or gave unexpected status.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Incorrect OTP validation failed with error:', err.message);
    process.exit(1);
  }

  console.log(`[Test] 5. Verifying OTP with the correct code: ${record.otp}...`);
  try {
    const verifyRes = await fetch(`${API_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: record.otp
      })
    });
    const verifyData = await verifyRes.json();
    console.log(`[Test] Correct OTP Verify Status: ${verifyRes.status}`, verifyData);

    if (verifyRes.status === 200 && verifyData.success) {
      console.log('✔ OTP successfully verified.');
    } else {
      console.error('❌ Correct OTP was rejected.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Correct OTP validation failed with error:', err.message);
    process.exit(1);
  }

  console.log(`[Test] 6. Signing up user after verification...`);
  try {
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        role: testRole,
        fullName: testName
      })
    });
    const signupData = await signupRes.json();
    console.log(`[Test] Verified Signup Status: ${signupRes.status}`, signupData);

    if (signupRes.status === 201 && signupData.success) {
      console.log('✔ User signup completed successfully.');
    } else {
      console.error('❌ Verified signup failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Verified signup failed with error:', err.message);
    process.exit(1);
  }

  console.log(`[Test] 7. Checking database state post-signup...`);
  const dbUser = await prisma.user.findUnique({
    where: { email: testEmail },
    include: { profile: true }
  });

  const dbOtp = await prisma.otpVerification.findUnique({
    where: { email: testEmail }
  });

  if (dbUser && dbUser.isVerified && dbUser.profile && dbUser.profile.fullName === testName) {
    console.log('✔ User created in DB, isVerified = true, and profile is initialized.');
  } else {
    console.error('❌ DB User or Profile state mismatch.');
    process.exit(1);
  }

  if (!dbOtp) {
    console.log('✔ OTP verification record cleaned up from database.');
  } else {
    console.error('❌ OTP verification record still exists in DB.');
    process.exit(1);
  }

  console.log(`[Test] 8. Logging in the new user...`);
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    console.log(`[Test] Login Status: ${loginRes.status}`, loginData);

    if (loginRes.status === 200 && loginData.success && loginData.data?.token) {
      console.log('✔ Login succeeded with valid token.');
    } else {
      console.error('❌ Login failed.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Login failed with error:', err.message);
    process.exit(1);
  }

  console.log(`[Test] 9. Cleaning up test user...`);
  try {
    await prisma.user.delete({
      where: { email: testEmail }
    });
    console.log('✔ Cleanup complete.');
  } catch (err) {
    console.error('Warning: Cleanup failed:', err.message);
  }

  console.log('\n============================================================');
  console.log('🎉 ALL OTP VERIFICATION FLOW TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('============================================================\n');
}

testOtpFlow().catch(console.error);
