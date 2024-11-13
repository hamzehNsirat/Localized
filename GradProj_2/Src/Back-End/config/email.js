const nodemailer = require('nodemailer');
const {
  EMAIL_SERVICE,
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
} = require("./env");

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    type: "OAuth2",
    user: EMAIL_USERNAME,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
    accessToken: "",
  },
});
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: EMAIL_USERNAME, // Sender address from .env
      to, // List of recipients
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
