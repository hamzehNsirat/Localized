const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const env = require("./env");
// OAuth2 setup
const oAuth2Client = new google.auth.OAuth2(
  env.oauthClientId, // Client ID
  env.oauthClientSecret, // Client Secret
  env.oauthRedirectUri // Redirect URI
);

// Set refresh token
oAuth2Client.setCredentials({
  refresh_token:
    env.oauthRefreshToken,
});
// Create a nodemailer transporter
const createTransporter = async () => {
  try {
    const accessToken = await oAuth2Client.getAccessToken(); // Generate a new access token

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: env.emailUsername,
        clientId: env.oauthClientId,
        clientSecret: env.oauthClientSecret,
        refreshToken: env.oauthRefreshToken,
        accessToken: accessToken.token,
      },
    });
  } catch (error) {
    console.error("Failed to create transporter:", error);
    throw error;
  }
};

// Function to send emails
const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: "localized.jo@gmail.com", // Sender email
      to, // Recipient email
      subject: subject || 'no reply Localized', // Email subject
      text, // Plain text
      html, // HTML content (optional)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${result.messageId}`);
    return result.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
