const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/User");
const keys = require("../config/keys");
const logger = require("../utils/logger");
// Manages user authentication (login, signup, password reset)
const generateToken = async (req, res) => {
  logger.info("Incoming Request for Token");
  const createToken = req.body;
  try {
    if (
      createToken.userId == null ||
      createToken.userRole == null ||
      createToken.userName == null
    ) {
      logger.info("Missing Data");
      return res.status(400).json({ message: "Missing Data" });
    }
    const payload = {
      userId: createToken.userId,
      role: createToken.userRole,
      username: createToken.userName,
    };
    // Generate JWT Token
    const token = jwt.sign(
      payload,
      keys.jwtSecret, // Use a secure key stored in .env
      { expiresIn: "1h" } // Token expiry
    );
    logger.info("Token generated successfully");
    role = createToken.userRole.toString();
    return res
      .status(201)
      .json({ token, role, message: "Token generated successfully" });
  } catch {
    logger.info("Internal server error");
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  generateToken
};