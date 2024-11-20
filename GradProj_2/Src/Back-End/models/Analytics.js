// Stores analytics data on products, sales, and trends
const {executeQuery} = require("../config/database"); 

const Analytics = {

  async getByDate(startDate, endDate) {
    return await executeQuery(
      "SELECT * FROM analytics_get_by_date($1, $2)",
      [startDate, endDate]
    );
  },


  // Get analytics by ID
  async getById(inputData) {
    return await executeQuery("SELECT * FROM analytics_get_by_id($1)", [
      inputData.analyticsId,
    ]);
  },

  // Get analytics by Product ID
  async getByProduct(inputData) {
    return await executeQuery("SELECT * FROM analytics_get_by_product($1)", [
      inputData.productId,
    ]);
  },

  // Insert analytics data
  async insert(inputData) {
    return await executeQuery(
      "SELECT * FROM analytics_insert($1, $2, $3, $4)",
      [
        inputData.productId,
        inputData.trends,
        inputData.salesCount || 0,
        inputData.viewsCount || 0,
      ]
    );
  },

  // Update analytics data
  async update(inputData) {
    return await executeQuery(
      "SELECT * FROM analytics_update($1, $2, $3, $4)",
      [
        inputData.analyticsId,
        inputData.trends,
        inputData.salesCount,
        inputData.viewsCount,
      ]
    );
  },

  // Delete analytics data
  async delete(inputData) {
    return await executeQuery("SELECT * FROM analytics_delete($1)", [
      inputData.analyticsId,
    ]);
  },
};

module.exports = Analytics;
