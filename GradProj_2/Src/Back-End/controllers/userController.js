// Manages user profiles and account actions
const userService = require("../services/userService");
const errorHandler = require("../middlewares/errorHandler");
// done -> needs testing
const getSingleUser =  async (req, res) => {
    try {
      const result = await userService.getUserById(req.body);
      if (result.success == false)
      {
        return errorHandler.handleError(res, "E0011", result);
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