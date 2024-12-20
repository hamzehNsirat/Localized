// Import Packages, Configurable Properties
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const env = require("./env");
const Notification = require("../models/Notification");
// Set oAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  env.oauthClientId,     // Client ID
  env.oauthClientSecret, // Client Secret
  env.oauthRedirectUri   // Redirect URI
);
// Set refresh token
oAuth2Client.setCredentials({
  refresh_token:
    env.oauthRefreshToken,
});

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
const sendEmail = async (to, subject, text, html) => {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: "Localized",           // Sender email
      to,                                       // Recipient email
      subject: subject || 'no reply | Localized', // Email subject
      text,                                     // Plain text
      html,                                     // HTML content (optional)
    };
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${result.messageId}`);
    return result.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
const submitNotification = async (
      notificationType,
      notifiedUserId,
      notificationPriority,
      notificationSubject,
      notificationDetails
) => 
{
      const notificationData = {
        notificationType: notificationType,
        notifiedUserId: notifiedUserId,
        notificationPriority: notificationPriority,
        notificationSubject: notificationSubject,
        notificationDetails: notificationDetails,
        lastModifiedBy: 1,
      };
      await Notification.insertNotification(notificationData);
}

/*
Email Events:
  1- Submit Application: User
  2- Application Approval: User 
  3- User Addition: User
  4- Requesting Password Reset: User
  5- Penalty Application: Owner
  6- Penalty Deletion: Owner
  7- Purchase Creation: Supplier
  8- Quotation Completion By Supplier: Retailer
Notification Events:
  User/Auth:
    1- User Sign Up
    2- User Update
    3- Password Update
  Dashboard:
    1- Details Update 
    2- RetailStore / Factory Update
  Platform Compliance:
    1- Review: Supplier
    2- Complaint Submittion: Retailer / Supplier (Respondant)
    3- Complaint Resolution:Retailer / Supplier (Complainant)
    4- Penalty Application: Penalized Est Owner
    5- Penalty Deletion: Penalized Est Owner
  Quotation:
    1- Request: Supplier
    2- Submit: Retailer
    3- Confirm / Reject: Supplier
    4- Complete: Retailer
  Purchase:
    1- Create Purchase: Supplier / Retailer
*/


module.exports = { sendEmail, submitNotification };
