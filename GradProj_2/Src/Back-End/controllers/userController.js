/*
--------------------
-- USER CYCLE --
- Get Single User 
- Get List of Users
- Update Single User
- Review User
- Delete User
- Add User
- Update User Status
- Get User All Details
- Search User
---------------------
*/ 
const userService = require("../services/userService");
const errorHandler = require("../middlewares/errorHandler");
// done -> needs testing
const getSingleUser = async (req, res) => {
  try {
    const result = await userService.getUserById(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0011", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0010", error.message);
  }
};
const updateSingleUser = async (req, res) => {
  try {
    const userData = req.body.user;
    const result = await userService.updateUser(userData);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0012", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0012", error.message);
  }
};
const getUserList = async (req, res) => {
  try {
    if (req.body.pageSize == null || req.body.pageIndex == null) {
      return errorHandler.handleError(res, "E0013");
    }
    const result = await userService.getUserList(
      req.user.userId,
      req.body.pageSize,
      req.body.pageIndex
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0014", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0014", error.message);
  }
};
const searchUser = async (req, res) => {
  try {
    if (
      req.body.searchTerm == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0086");
    }
    const result = await userService.searchUsers(
      req.body.searchTerm,
      req.body.pageSize,
      req.body.pageIndex
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0011", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0011", error.message);
  }
};
const reviewUser = async (req, res) => {
  try {
    if (req.body.userStatus == null) {
      return errorHandler.handleError(res, "E0015");
    }
    const userData = {
      userId: req.body.userId,
      userStatus: req.body.userStatus,
      lastModifiedBy: req.user.userId,
    };

    const result = await userService.reviewUser(userData);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0016", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0016", error.message);
  }
};
const deleteUser = async (req, res) => {
  try {
    if (req.body.userId == null) {
      return errorHandler.handleError(res, "E0017");
    }
    const result = await userService.deleteUser(req.body.userId);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0018", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0018", error.message);
  }
};
const getUserAllData = async (req, res) => {
  try {
    const result = await userService.getUserAllData(req.body.userId, req.body.userType);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0011", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0010", error.message);
  }
};
const updateUserStatus = async (req, res) => {
  try {
    const result = await userService.updateUserStatus(
      req.body.userId,
      req.body.userStatus
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0012", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0012", error.message);
  }
};
const addUser = async (req, res) => {
  try {
    const result = await userService.addUser(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0006", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0006", error.message);
  }
};
const changePassword = async (req, res) => {
  try {
    const result = await userService.changePassword(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0032", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0032", error.message);
  }
};

module.exports = {
  getSingleUser,
  updateSingleUser,
  getUserList,
  reviewUser,
  deleteUser,
  searchUser,
  getUserAllData,
  updateUserStatus,
  addUser,
  changePassword,
};
