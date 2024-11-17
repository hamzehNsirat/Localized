// Notification Model
const executeQuery = require("../config/database"); // Database connection

const Notification = {
  async insertNotification(inputData) {
    return await executeQuery(
      "SELECT notifications_insert($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
      [
        inputData.notificationType,
        inputData.notifiedUserId,
        inputData.notificationPriority,
        inputData.notificationEmail,
        inputData.notificationPhoneNum,
        inputData.notificationMessage,
        inputData.notificationSubject,
        inputData.isEmailVerified,
        inputData.notificationStatus,
        inputData.notificationStatusDesc,
        inputData.numberOfTries,
        inputData.numberOfMaxTries,
        inputData.isFinalFailed,
        inputData.lastModifiedBy,
      ]
    );
  },

  async getNotifications(pageSize, pageIndex) {
    return await executeQuery("SELECT * FROM notifications_get($1, $2)", [
      pageSize,
      pageIndex,
    ]);
  },
};

module.exports = Notification;
