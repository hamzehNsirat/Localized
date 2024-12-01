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
    if (
      req.body.pageSize == null ||
      req.body.pageIndex == null ||
      req.body.pageIndex <= 0
    ) {
      return errorHandler.handleError(res, "E0023");
    }
    const result = await authService.getApplicationsList(
      req.body.pageSize,
      req.body.pageIndex
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0024", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0024");
  }
};

module.exports = {
  getRetailerAllDetails,
};