// Manages quotations (request, send, accept, reject)
const productService = require("../services/productService");
const quotationService = require("../services/quotationService");
const errorHandler = require("../middlewares/errorHandler");
const { executeQuery } = require("../config/database");
const requestQuotation = async (req, res) => {
  try {
    if (
      req.body.retailerId == null ||
      req.body.supplierId == null ||
      req.body.quotationDetails == null ||
      req.body.retailerEstablishmentName == null ||
      req.body.supplierEstablishmentName == null ||
      req.body.shippingAddress == null
    ) {
      return errorHandler.handleError(res, "E0041");
    }
    const result = await quotationService.requestQuotation(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0042", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0042");
  }
};
module.exports = {
  requestQuotation,
};
