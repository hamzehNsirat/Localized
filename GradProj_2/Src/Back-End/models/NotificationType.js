const executeQuery = require("../config/database");

const NotificationType = {
  async getAllNotificationTypes() {
    return await executeQuery("SELECT * FROM notification_type_get_all()", []);
  },

  async getNotificationTypeById(notificationTypeId) {
    return await executeQuery("SELECT * FROM notification_type_get_by_id($1)", [
      notificationTypeId,
    ]);
  },

  async insertNotificationType(inputData) {
    return await executeQuery(
      "SELECT FROM notification_type_insert($1, $2)",
      [inputData.notificationTypeDescription, inputData.lastModifiedBy]
    );
  },

  async updateNotificationType(notificationTypeId, inputData) {
    return await executeQuery(
      "SELECT FROM notification_type_update($1, $2, $3)",
      [
        notificationTypeId,
        inputData.notificationTypeDescription,
        inputData.lastModifiedBy,
      ]
    );
  },

  async deleteNotificationType(notificationTypeId) {
    return await executeQuery("SELECT FROM notification_type_delete($1)", [
      notificationTypeId,
    ]);
  },
};

module.exports = NotificationType;
