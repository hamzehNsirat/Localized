const authService = require("../services/authService");
const errorHandler = require("../middlewares/errorHandler");
const { executeQuery } = require("../config/database");
// Manages user authentication (login, signup, password reset)
const signUp = async (req, res) => {
  try {
    const { user, establishment } = req.body;

    if (!user || !user.userType) {
      return errorHandler.handleError(res, "E0005");
    }

    const result = await authService.registerUser(user, establishment);

    if (!result.success) {
      return errorHandler.handleError(res, "E0006", result);
    }
    return errorHandler.handleSuccess(res, result, 201);
  } catch (error) {
    console.error("Sign-up error:", error);
    return errorHandler.handleError(res, "9999");
  }
};
const signIn = async (req, res) => {
  try {
    const { user } = req.body;

    if (!user.userName || !user.userPassword) {
      return errorHandler.handleError(res, "E0007");
    }

    const result = await authService.loginUser(user);

    if (!result.success) {
      return errorHandler.handleError(res, "E0008", result);
    }
    return errorHandler.handleSuccess(res, result, 200);
  } catch (error) {
    console.error("Sign-in error:", error);
    return errorHandler.handleError(res, "9999");
  }
};

const signOut = async (req, res, next) => {
  try {
    const userId  = req.user.userId; // Extract user information from the decoded token (middleware-provided)
    // Invalidate the token by incrementing the user's token version in the database
    await executeQuery(
      "UPDATE user_localized SET token_version = token_version + 1 WHERE user_id = $1",
      [parseInt(userId)]
    );
    // Respond with a success message
    return errorHandler.handleSuccess(
      res,
      { success: true, message: "User successfully logged out" },
      200
    );
  } catch (error) {
    // Handle any errors
    return errorHandler.handleError(res,'E0009');
  }
};

const submitApplication = async (req, res) => {
  try {
    const applicationData = req.body;
    
    if (!req.body.userType) {
      return errorHandler.handleError(res, "E0005");
    }
    const result = await authService.submitApplication(applicationData);

    if (result.success == false) {
      return errorHandler.handleError(res, "E0019", result);
    }
    return errorHandler.handleSuccess(res, result, 201);
  } catch (error) {
    console.error("Submit App error:", error);
    return errorHandler.handleError(res, "E0019");
  }
};
const checkUsernameAvailability = async (req, res) => {
  try {
    if (!req.body.username) {
      return errorHandler.handleError(res, "E0020");
    }
    const result = await authService.checkUsernameAvailability(
      req.body.username
    );

    if (result.success == false) {
      return errorHandler.handleError(res, "E0021", result);
    }
    return errorHandler.handleSuccess(res, result, 200);
  } catch (error) {
    console.error("Check Username error:", error);
    return errorHandler.handleError(res, "E0021");
  }

};
const checkApplicationStatus = async (req, res) => {
  try {
    if (!req.body.username && !req.body.email) {
      return errorHandler.handleError(res, "E0021");
    }
    const result = await authService.checkApplicationStatus(req.body);

    if (result.success == false) {
      return errorHandler.handleError(res, "E0022", result);
    }
    return errorHandler.handleSuccess(res, result, 200);
  } catch (error) {
    console.error("Check App error:", error);
    return errorHandler.handleError(res, "E0022");
  }
};
const getApplicationsList = async (req, res) => {
  try {
    if (
      req.body.pageSize == null ||
      (req.body.pageIndex == null ||
      req.body.pageIndex <= 0)
    ) {
      return errorHandler.handleError(res, "E0023");
    }
    const result = await authService.getApplicationsList(
      req.body.pageSize,
      req.body.pageIndex
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0024", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0024");
  }
};
const getApplicationById = async (req, res) => {
  try {
    if (req.body.applicationId == null || parseInt(req.body.applicationId) <= 0) {
      return errorHandler.handleError(res, "E0025");
    }
    const result = await authService.getApplicationById(req.body.applicationId);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0026", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0026");
  }
};
const updateApplicationStatus = async (req, res) => {
  try {
    if (!req.body.applicationId && !req.body.status) {
      return errorHandler.handleError(res, "E0027");
    }
    const result = await authService.updateApplicationStatus(req.body);

    if (result.success == false) {
      return errorHandler.handleError(res, "E0028", result);
    }
    return errorHandler.handleSuccess(res, result, 200);
  } catch (error) {
    console.error("Update App error:", error);
    return errorHandler.handleError(res, "E0028");
  }
};


module.exports = {
  signUp,
  signIn,
  signOut,
  submitApplication,
  checkUsernameAvailability,
  checkApplicationStatus,
  getApplicationsList,
  getApplicationById,
  updateApplicationStatus,
};
