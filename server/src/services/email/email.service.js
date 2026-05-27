import { logger } from '../../utils/logger.js';

/**
 * Dispatches a premium HTML 6-digit OTP email using the Brevo HTTPS REST API
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit verification code
 */
export const sendOtpEmail = async (email, otp) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "TalentStage";

  if (!brevoApiKey || !senderEmail) {
    throw new Error("Brevo credentials (BREVO_API_KEY and BREVO_SENDER_EMAIL) are not configured in environment variables.");
  }

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
    logger.info(`Attempting to send OTP email to ${email} via Brevo HTTP API...`);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: email
          }
        ],
        subject: `${otp} is your TalentStage verification code`,
        htmlContent: htmlContent
      })
    });

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = responseData.message || `HTTP ${response.status} Error`;
      throw new Error(errorMessage);
    }

    logger.info(`OTP email sent to ${email} successfully via Brevo API (Message ID: ${responseData.messageId}).`);
  } catch (error) {
    logger.error(`Failed to send OTP email to ${email} via Brevo API: ${error.message}`);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};
