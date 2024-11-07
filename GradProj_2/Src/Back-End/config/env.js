//  Loads environment variables (optional, depending on project setup)
require("dotenv").config();

const config = {
  // Server Config
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || "development",
    baseUrl: process.env.BASE_URL || `http://localhost:${environment}`,
  },

  // Database Config
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    dialect: process.env.DB_DIALECT || "postgres",
  },

  // JWT Config
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "86400", // Default to 1 day if not specified
  },

  // Email service settings for notifications
  email: {
    service: process.env.EMAIL_SERVICE,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    oauth: {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      refreshToken: process.env.REFRESH_TOKEN,
    },
  },

  // Security settings
  security: {
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15, // Rate limit window in minutes
    rateLimitMaxRequests:
      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100, // Max requests per window
    passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS, 10) || 10, // Salt rounds for password hashing
  },

  // CORS (Cross-Origin Resource Sharing) settings
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS
      ? process.env.CORS_ALLOWED_ORIGINS.split(",")
      : ["http://localhost:3000"]
  }
};

// Validate Existence of Essential Configs
if (!config.jwt.secret) {
    throw new Error('Unable to Fetch JWT Secret from Environment');
}

if(!config.database.name || !config.database.password || !config.database.user) {
    throw new Error("Incomplete Database Configuration Fields");
}

module.exports = config;