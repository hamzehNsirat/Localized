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
const getQuotationByRetailer = async (req, res) => {
  try {
    if (
      req.body.retailerId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0045");
    }
    const result = await quotationService.getQuotationByRetailer(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0046", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0046");
  }
};
const getQuotationById = async (req, res) => {
  try {
    if (
      req.body.quotationId == null 
    ) {
      return errorHandler.handleError(res, "E0047");
    }
    const result = await quotationService.getQuotationById(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0048", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0048");
  }
};
const updateQuotationStatus = async (req, res) => {
  try {
    if (req.body.quotationId == null || req.body.quotationStatusId == null) {
      return errorHandler.handleError(res, "E0049");
    }
    const result = await quotationService.updateQuotationStatus(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0050", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0050");
  }
};
module.exports = {
  requestQuotation,
  getQuotationByRetailer,
  getQuotationById,
  updateQuotationStatus,
};
