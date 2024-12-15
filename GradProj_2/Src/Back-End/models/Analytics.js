const db = require("../config/database");

const AnalyticsModel = {
  // Get Analytics by User ID
  async getAnalyticsByUserId(userId) {
    const query = `
            SELECT * FROM analytics_get_by_user_id($1)
        `;
    try {
      return await db.executeQuery(query, [userId]);
    } catch (error) {
      console.error("Error in getAnalyticsByUserId:", error);
      throw error;
    }
  },

  // Insert Analytics
  async insertAnalytics(userId, capture) {
    const query = `
            SELECT analytics_insert($1, $2) AS out_analytics_id
        `;
    try {
      const result = await db.executeQuery(query, [userId, capture]);
      return result[0]?.out_analytics_id;
    } catch (error) {
      console.error("Error in insertAnalytics:", error);
      throw error;
    }
  },

  // Update Analytics
  async updateAnalytics(capture, analyticsId) {
    const query = `
            SELECT analytics_update($1, $2) AS result
        `;
    try {
      const result = await db.executeQuery(query, [capture, analyticsId]);
      return result[0]?.result === 0;
    } catch (error) {
      console.error("Error in updateAnalytics:", error);
      throw error;
    }
  },

  // Delete Analytics
  async deleteAnalytics(analyticsId) {
    const query = `
            SELECT analytics_delete($1) AS result
        `;
    try {
      const result = await db.executeQuery(query, [analyticsId]);
      return result[0]?.result === 0;
    } catch (error) {
      console.error("Error in deleteAnalytics:", error);
      throw error;
    }
  },
};

module.exports = AnalyticsModel;
