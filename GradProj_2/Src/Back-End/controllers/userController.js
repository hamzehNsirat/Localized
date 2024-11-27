// Manages user profiles and account actions
const userService = require("../services/userService");
const errorHandler = require("../middlewares/errorHandler");


// done -> needs testing
const getSingleUser =  async (req, res) => {
    try {
      const { userId } = req.user.userId; // Extract userId from the token
      const result = await userService.getUserById(userId);
      if (result.success == false)
      {
        return errorHandler.handleError(res, "E0011", error.message);
      }
      return errorHandler.handleSuccess(res, result);
    } catch (error) {    
      return errorHandler.handleError(res, "E0010", error.message);
    }
};

const updateSingleUser = async (req, res) =>  {
  try {
    const userData = req.body;
    const result = await userService.updateUser(userData);
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0010", error.message);
  }
};

module.exports = {
    getSingleUser,
    updateSingleUser
}