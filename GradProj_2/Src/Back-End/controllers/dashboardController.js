// Loads role-specific dashboards and data analytics
const dashboardService = require("../services/dashboardService");
const errorHandler = require("../middlewares/errorHandler");
const { executeQuery } = require("../config/database");
// RetailerDashboard 
// - service: fetch user / Retailer data,
// - service: get progress bar profile, user id returns percantage of completed data in terms of User / - Supplier-RETAILER
// - service: get progress bar establishment, returns percantage of completed data
// - service: Insights (postponed)
const getRetailerAllDetails = async (req, res) => {
  try {
    if (req.body.userId == null) {
      return errorHandler.handleError(res, "E0033");
    }
    const result = await dashboardService.getRetailerAllDetails(
      req.body.userId
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0034", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0034");
  }
};
const getRetailerNotifications = async (req, res) => {
  try {
    if (
      req.body.userId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0063");
    }
    const result = await dashboardService.getRetailerNotifications(
      req.body
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0064", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0064");
  }
};
module.exports = {
  getRetailerAllDetails,
  getRetailerNotifications,
};