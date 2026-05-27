import nodemailer from 'nodemailer';
import { logger } from '../../utils/logger.js';

let transporter = null;

/**
 * Returns a cached Nodemailer SMTP transporter.
 * Dynamically reads credentials at call-time to prevent ESM environment variable loading hoisting issues.
 */
const getTransporter = () => {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("SMTP email credentials (EMAIL_USER and EMAIL_PASS) are not configured in environment variables.");
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return transporter;
};

/**
 * Dispatches a premium HTML 6-digit OTP email using Gmail SMTP
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit verification code
 */
export const sendOtpEmail = async (email, otp) => {
  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #e50914; margin-bottom: 24px;">Verify your TalentStage Account</h2>
      <p style="font-size: 16px; color: #1e293b; line-height: 24px;">Thank you for registering. Please enter the following 6-digit verification code to complete your signup process:</p>
      <div style="margin: 30px 0; text-align: center;">
        <span style="background-color: #f1f5f9; color: #1e293b; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 6px; padding: 16px 32px; border-radius: 8px; border: 1px solid #cbd5e1; display: inline-block;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #dc2626; font-weight: bold;">This code will expire in 5 minutes and can only be used once.</p>
      <p style="font-size: 14px; color: #64748b; line-height: 20px; margin-top: 24px;">If you did not request this verification code, please ignore this email or contact support if you have security concerns.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
      <p style="font-size: 11px; color: #94a3b8; text-align: center;">© 2026 TalentStage. Vetted Freelance Marketplace.</p>
    </div>
  `;

  try {
    logger.info(`Attempting to send OTP email to ${email} via Gmail SMTP...`);
    
    const smtpTransporter = getTransporter();
    const mailOptions = {
      from: `"TalentStage Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${otp} is your TalentStage verification code`,
      html: htmlContent,
    };

    const info = await smtpTransporter.sendMail(mailOptions);
    logger.info(`OTP email sent to ${email} successfully via Gmail SMTP (Message ID: ${info.messageId}).`);
  } catch (error) {
    logger.error(`Failed to send OTP email to ${email} via Gmail SMTP: ${error.message}`);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};
