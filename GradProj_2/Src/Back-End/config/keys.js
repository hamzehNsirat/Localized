// Stores API keys and other sensitive configurations if needed
const keys = {
  // Essential server and application settings
  port: 5055,
  baseUrl: "http://localhost:5055",
  environment: "development",
  

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
    "1//04AfbS5JcX9RPCgYIARAAGAQSNwF-L9IrWqxhnxKWE6Kgls3aySwbISG8IgVmrQ5xZYpAKVmYqJIQEOKdDYgb0YS9842uvdsZo_I",

  // Security settings
  rateLimitWindow: 15, // Rate limit window in minutes
  rateLimitMaxRequests: 100, // Max requests per window
  passwordSaltRounds: 10, // Salt rounds for password hashing

  // CORS settings
  allowedOrigins: ["http://localhost:5055"],
};

module.exports = keys;
