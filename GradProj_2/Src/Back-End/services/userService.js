const userModel = require("../models/User");

const userService = {
  async getUserById (userId)  {
  // Fetch user details by user ID
  const dbFetch =  await userModel.get(userId);
  if (dbFetch[0].length = 0 || !dbFetch)
  {

  }

  return {
        success: true,
        nationalNumber: dbFetch.national_number,
        userType: dbFetch.user_type,
        userStatus: dbFetch.user_status,
        firstName: dbFetch.first_name,
        middleName: dbFetch.middle_name,
        lastName: dbFetch.last_name,
        fullName: firstName + middleName + lastName,
        dateOfBirth: dbFetch.date_of_birth,
        userEmail: dbFetch.user_email,
        userPhone: dbFetch.user_phone_number
  }

}
}
module.exports = userService;
