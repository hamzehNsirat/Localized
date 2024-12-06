//  Manages orders, status updates, cancellations// Manages quotations (request, send, accept, reject)
const platformCompService = require("../services/platformComplianceService");
const errorHandler = require("../middlewares/errorHandler");
const { executeQuery } = require("../config/database");
const submitReview = async (req, res) => {
  try {
    if (
      req.body.supplierId == null ||
      req.body.retailerId == null ||
      req.body.rating == null ||
      req.body.reviewComment == null
    ) {
      return errorHandler.handleError(res, "E0053");
    }
    const result = await platformCompService.submitReview(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0054", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0054");
  }
};
module.exports = {
  submitReview,
};
