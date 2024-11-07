// Stores API keys and other sensitive configurations if needed

const config = require('./config/env');
const environment = process.env.NODE_ENV || 'development';

// Choose config based on environment
const keys = {
    // Essential server and application settings
    port: config.server.port,
    baseUrl: config.server.baseUrl,

    // Database credentials
    dbHost: config.database.host,
    dbPort: config.database.port,
    dbName: config.database.name,
    dbUser: config.database.user,
    dbPass: config.database.password,
    dbDialect: config.database.dialect,

    // JWT configuration
    jwtSecret: config.jwt.secret,
    jwtExpiresIn: config.jwt.expiresIn,

    // Email service credentials (essential)
    emailService: config.email.service,
    emailUsername: config.email.username,
    emailPassword: config.email.password,
    emailFrom: config.email.from,
    oauthClientId: config.email.oauth.clientId,
    oauthClientSecret: config.email.oauth.clientSecret,
    oauthRedirectUri: config.email.oauth.redirectUri,
    oauthRefreshToken: config.email.oauth.refreshToken,

    // Security settings
    rateLimitWindow: config.security.rateLimitWindow,
    rateLimitMaxRequests: config.security.rateLimitMaxRequests,
    passwordSaltRounds: config.security.passwordSaltRounds,

    // CORS settings
    allowedOrigins: config.cors.allowedOrigins
};

module.exports = keys;
