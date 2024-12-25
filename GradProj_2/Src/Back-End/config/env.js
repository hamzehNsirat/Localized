//  Loads environment variables
const env = {
  // Essential server and application settings
  port: 5055,
  baseUrl: "http://localhost:5055",
  environment: "development",
  frontEndURL: "http://localhost:5173",
  // Database credentials
  dbHost: "localhost",
  dbPort: 5432,
  dbName: "Localized",
  dbUser: "postgres",
  dbPass: "admin",
  dbDialect: "postgres",
  // JWT configuration
  jwtSecret: "d4f7e8g9h2j5k6m1n4p8s7t9v6x3z5b8a7d2g1h5j9k3p8m",
  jwtExpiresIn: "86400", // Default to 1 day
  // Email service credentials
  emailService: "gmail",
  emailUsername: "localized.jo@gmail.com",
  emailPassword: "localized2024",
  emailFrom: "your_email@gmail.com",
  oauthClientId:
    "357590222030-05hoed3gg747pq4c2opnddq04h6fmaif.apps.googleusercontent.com",
  oauthClientSecret: "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",
  oauthRedirectUri: "https://developers.google.com/oauthplayground",
  oauthRefreshToken:
    "1//04-xeslr1HCazCgYIARAAGAQSNwF-L9IrNBO15Cg1-KijIEeSDf83Q317eyVo5rdEMzcUWZes3jBZxbmLZMSW_5kKjd5FVsrIRFg",
  // CORS settings
  allowedOrigins: ["http://localhost:5055", "http://localhost:5173"],
};
;

// Validate Existence of Essential Configs
if (!env.jwtSecret) {
  throw new Error("Unable to Fetch JWT Secret from Environment");
}

if (!env.dbName || !env.dbPass || !env.dbUser) {
  throw new Error("Incomplete Database Configuration Fields");
}

module.exports = env;