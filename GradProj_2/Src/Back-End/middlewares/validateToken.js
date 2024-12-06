const jwt = require("jsonwebtoken");
const keys = require("../config/keys"); // JWT secret and configurations
const errorHandler = require("../middlewares/errorHandler");
const { executeQuery } = require("../config/database");

const validateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorHandler.handleError(res, 'TOKEN_MISSING');
  }
 
  const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, keys.jwtSecret);
    const token_ver = await executeQuery("SELECT token_version FROM user_localized WHERE user_id = $1", [decoded.userId]);
    const token_DB  = token_ver[0].token_version;
    if (decoded.tokenVersion != token_DB)
    {
        return errorHandler.handleError(res, 'TOKEN_EXPIRED');
    }
    req.user = decoded; // Attach decoded payload to request object
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return errorHandler.handleError(res,'TOKEN_EXPIRED');
  }
};

module.exports = validateToken;
