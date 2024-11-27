const userModel = require("../models/User");

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
        dbFetch[0].first_name + " " + (dbFetch[0].middle_name || '') +" " + dbFetch[0].last_name,
      dateOfBirth: dbFetch[0].date_of_birth,
      userEmail: dbFetch[0].user_email,
      userPhone: dbFetch[0].user_phone_number,
    };
  },
  async updateUser(userData) {
    // Fetch user details by user ID
    const user = { userId: userId };
    const dbFetch = await userModel.get(user);
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
        dbFetch[0].first_name + dbFetch[0].middle_name + dbFetch[0].last_name,
      dateOfBirth: dbFetch[0].date_of_birth,
      userEmail: dbFetch[0].user_email,
      userPhone: dbFetch[0].user_phone_number,
    };
  },
};
module.exports = userService;
