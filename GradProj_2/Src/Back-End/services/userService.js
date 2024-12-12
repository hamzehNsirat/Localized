// Conatins User Related Logic (Get/GetList/Update/Delete)
const userModel = require("../models/User");
const logDBModel = require('../models/Log'); 
const usrReviewModel = require("../models/UserReview"); 
const Notification = require("../models/Notification");

const userService = {
  async getUserById(userData) {
    // Fetch user details by user ID
    const dbFetch = await userModel.get(userData);
    if (!dbFetch[0]) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      nationalNumber: dbFetch[0].national_number,
      userType: dbFetch[0].user_type,
      userStatus: dbFetch[0].user_status,
      firstName: dbFetch[0].first_name,
      middleName: dbFetch[0].middle_name,
      lastName: dbFetch[0].last_name,
      fullName:
        dbFetch[0].first_name +
        " " +
        (dbFetch[0].middle_name || "") +
        " " +
        dbFetch[0].last_name,
      dateOfBirth: dbFetch[0].date_of_birth,
      userEmail: dbFetch[0].user_email,
      userPhone: dbFetch[0].user_phone_number,
      userName: dbFetch[0].user_name,
      userAddress: dbFetch[0].user_address,
      userImage: dbFetch[0].user_image,
    };
  },
  async updateUser(userData) {
    // Update user details
    if (userData.userPassword != null) {
      userData.isPassChange = true;
    } else {
      userData.isPassChange = false;
    }
    userData.lastModifiedBy = userData.userId;
    const dbUpdate = await userModel.update(userData);
    if (dbUpdate[0].update_res != 0) {
      return {
        success: false,
      };
    }
    const inputData = {
      logUserId: userData.userId,
      actionDetails: "Update User Data for User Id: " + userData.userId,
      actionJsonPayload: null,
      actionDescription: "DATA UPDATE",
      isTransactional: true,
    };
    await logDBModel.insertLog(inputData);
    notificationData = {
      notificationType: 10,
      notifiedUserId: userData.userId,
      notificationPriority: 1,
      notificationSubject: "Profile Updated",
      notificationDetails: `your profile has been updated!`,
      lastModifiedBy: 1,
    };
    await Notification.insertNotification(notificationData);

    
    return {
      success: true,
    };
  },
  async getUserList(pageSize, pageIndex) {
    const inputData = {
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    const dbFetchList = await userModel.getList(inputData);
    if (!dbFetchList[0]) {
      return {
        success: false,
        error: "Unable to Fetch Users from Database",
      };
    }
    const userList = { user: [] };

    for (let i = 0; i < dbFetchList.length; i++) {
      const item = dbFetchList[i]; // Fetch the current item once
      const userObject = {}; // Create a new object for each user

      userObject.userId = item.user_id;
      userObject.nationalNumber = item.national_number;

      // Map user_type to userType string
      if (item.user_type === 1) {
        userObject.userType = "Admin";
      } else if (item.user_type === 2) {
        userObject.userType = "Supplier";
      } else {
        userObject.userType = "Retailer";
      }

      userObject.userStatus = item.user_status;
      userObject.firstName = item.first_name;
      userObject.middleName = item.middle_name;
      userObject.lastName = item.last_name;
      userObject.username = item.user_name;
      userObject.email = item.user_email;
      userObject.phone = item.user_phone_number;
      userObject.dateOfBirth = item.date_of_birth;
      userObject.userAddress = item.user_address;
      userObject.isEmailVerified = item.is_email_verified;
      userObject.userImage = item.user_image;

      // Add the userObject to the user array
      userList.user.push(userObject);
    }
    return {
      success: true,
      userList: userList,
    };
  },
  async reviewUser(userData) {
    // Update user details
    const dbUpdate = await userModel.updateStatus(userData);
    if (dbUpdate[0].update_res != 0) {
      return {
        success: false,
      };
    }
    const inputData = {
      logUserId: userData.userId,
      actionDetails: "Update User Data for User Id: " + userData.userId,
      actionJsonPayload: null,
      actionDescription: "DATA UPDATE",
      isTransactional: true,
    };
    await logDBModel.insertLog(inputData);
    const inputData2 = {
      adminId: userData.lastModifiedBy,
      userId: userData.userId,
      decisionTaken: "ADMITTANCE",
      decisionReason: "",
      creationDate: new Date(),
      lastModifiedBy: 1,
    };
    await usrReviewModel.insert(inputData2);
    return {
      success: true,
    };
  },
  async deleteUser(userId) {
    // Update user details
    userData = { userId: userId };
    const dbDelete = await userModel.delete(userData);
    if (dbDelete[0].update_res != 0) {
      return {
        success: false,
      };
    }
    const inputData = {
      logUserId: userData.userId,
      actionDetails: "Delete User Data for User Id: " + userData.userId,
      actionJsonPayload: null,
      actionDescription: "DATA UPDATE",
      isTransactional: true,
    };
    await logDBModel.insertLog(inputData);

    return {
      success: true,
    };
  },
};
module.exports = userService;
