const jwt = require("jsonwebtoken");
const authService = require("../services/authService"); 
const errorHandler = require("../middlewares/errorHandler");

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
    ) 
    {
      logger.info("Missing Data");
      return errorHandler.handleError(res, "E0002");
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
    return errorHandler.handleSuccess(res, token, 201);
  } catch {
    logger.info("Internal server error");
    return errorHandler.handleError(res, "9999");
  }
};


const signUp = async(req, res) => {
    debugger;
    try {
      const { user, establishment } = req.body;

      if (!user || !user.userType) {

        return errorHandler.handleError(res,"E0005");

      }

      const result = await authService.registerUser(user, establishment);

      if (!result.success) {
        return errorHandler.handleError(res, "E0006");
      }
      return errorHandler.handleSuccess(res, result, 201);
    } catch (error) {
      console.error("Sign-up error:", error);
      return errorHandler.handleError(res, "9999");
    }
};

module.exports = {
  generateToken,
  signUp
};