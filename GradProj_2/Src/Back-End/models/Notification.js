const { executeQuery } = require("../config/database");

const Notification = {
  async insertNotification(notificationData) {
    const query = `
      SELECT notification_insert($1, $2, $3, $4, $5, $6) AS notification_id
    `;
    const params = [
      notificationData.notificationType,
      notificationData.notifiedUserId,
      notificationData.notificationPriority,
      notificationData.notificationSubject,
      notificationData.notificationDetails,
      notificationData.lastModifiedBy,
    ];
    return await executeQuery(query, params);
  },

  async getNotificationsByUserId(userId, pageSize, pageIndex) {
    const query = `
      SELECT * FROM get_notifications_by_user_id($1, $2, $3)
    `;
    const params = [userId, pageSize, pageIndex];
    return await executeQuery(query, params);
  },

  async markNotificationAsRead(notificationId, lastModifiedBy) {
    const query = `
      SELECT mark_notification_as_read($1, $2) AS result
    `;
    const params = [notificationId, lastModifiedBy];
    return await executeQuery(query, params);
  },

  async deleteNotification(notificationId) {
    const query = `
      SELECT delete_notification($1) AS result
    `;
    const params = [notificationId];
    return await executeQuery(query, params);
  },
};

module.exports = Notification;
