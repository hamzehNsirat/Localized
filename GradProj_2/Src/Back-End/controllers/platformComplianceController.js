// Controls the Route / Service Interaction for the following:
/*
-----------------
-- REVIEW CYCLE--
- Submit Review
----------------------
-- COMPLAINTS CYCLE --
- Get Complaint Details
- Get Complaints List
- Get Retailer Complaints
- Get Supplier Complaints
- Update Complaint
- Update Complaint Status
- Create Complaint
- Get Complaint Types
- Get Quotation Actors for Supplier
- Get Quotation Actors for Retailer
---------------------
-- PENALTIES CYCLE --
- Get Penalties List 
- Get Penalty Detailes 
- Get Complaint Related Establishments 
- Create Penalty
- Update Penalty 
- Update Penalty Status
- Reflect Penalty on Establishment Indicator Calculations
*/ 
const platformCompService = require("../services/platformComplianceService");
const errorHandler = require("../middlewares/errorHandler");
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

const getComplaintsRetailer = async (req, res) => {
  try {
    if (
      req.body.retailerId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0055");
    }
    const result = await platformCompService.getComplaintsRetailer(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0056", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0056");
  }
};
const getComplaintById = async (req, res) => {
  try {
    if (req.body.complaintId == null) {
      return errorHandler.handleError(res, "E0057");
    }
    const result = await platformCompService.getComplaintById(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0058", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0058");
  }
};
const getQuotationSupplierComplaint = async (req, res) => {
  try {
    if (req.body.supplierId == null) {
      return errorHandler.handleError(res, "E0059");
    }
    const result = await platformCompService.getQuotationSupplierComplaint(
      req.body
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0059", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0059");
  }
};
const getQuotationRetailerComplaint = async (req, res) => {
  try {
    const result = await platformCompService.getQuotationRetailerComplaint(
      req.body
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0059", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0059");
  }
};
const getComplaintTypes = async (req, res) => {
  try {
    const result = await platformCompService.getComplaintTypes();
    if (result.success == false) {
      return errorHandler.handleError(res, "E0060", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0060");
  }
};
const createComplaint = async (req, res) => {
  try {
    if (
      req.body.complaintTitle == null ||
      req.body.complaintTypeId == null ||
      req.body.supplierId == null ||
      req.body.retailerId == null ||
      req.body.complaintNotes == null ||
      req.body.quotationId == null ||
      req.body.submitterType == null
    ) {
      return errorHandler.handleError(res, "E0061");
    }
    const result = await platformCompService.createComplaint(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0062", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    console.log(error);
    return errorHandler.handleError(res, "E0062");
  }
};
const getComplaintsSupplier = async (req, res) => {
  try {
    if (
      req.body.supplierId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0081");
    }
    const result = await platformCompService.getComplaintsSupplier(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0080", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0080");
  }
};
const getComplaintsList = async (req, res) => {
  try {
    if (
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0013");
    }
    const result = await platformCompService.getComplaintsList(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0080", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0080");
  }
};
const searchComplaints = async (req, res) => {
  try {
    if (
      req.body.searchTerm == null ||
      req.body.pageSize   == null ||
      req.body.pageIndex  == null
    ) {
      return errorHandler.handleError(res, "E0086");
    }
    const result = await platformCompService.getComplaintsList(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0039", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0039");
  }
};
const updateComplaint = async (req, res) => {
  try {
    if (
      req.body.complaintId == null 
    ) {
      return errorHandler.handleError(res, "E0057");
    }
    const result = await platformCompService.updateComplaint(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0090", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0090");
  }
};

const getPenalties = async (req, res) => {
  try {
    if (req.body.pageSize == null || req.body.pageIndex == null) {
      return errorHandler.handleError(res, "E0013");
    }
    const result = await platformCompService.getPenalties(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0091", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0091");
  }
};
const searchPenalties = async (req, res) => {
  try {
    if (
      req.body.searchTerm == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0086");
    }
    const result = await platformCompService.searchPenalties(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0039", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0039");
  }
};
const viewPenalty = async (req, res) => {
  try {
    if (req.body.penaltyId == null) {
      return errorHandler.handleError(res, "E0092");
    }
    const result = await platformCompService.viewPenalty(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0093", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0093");
  }
};
const getPenaltyTypes = async (req, res) => {
  try {
    const result = await platformCompService.getPenaltyTypes(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0097", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0097");
  }
};
const addPenalty = async (req, res) => {
  try {
    if (
      req.body.penaltyTypeId == null ||
      req.body.establishmentId == null ||
      req.body.penaltyInitiatorId == null ||
      req.body.penaltyWeight == null ||
      req.body.relatedComplaintId == null
    ) {
      return errorHandler.handleError(res, "E0094");
    }
    const result = await platformCompService.addPenalty(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0095", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    console.log(error);
    return errorHandler.handleError(res, "E0095");
  }
};
const deletePenalty = async (req, res) => {
  try {
    if (req.body.penaltyId == null) {
      return errorHandler.handleError(res, "E0092");
    }
    const result = await platformCompService.deletePenalty(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0096", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0096");
  }
};
const updateSupplierViews = async (req, res) => {
  try {
    if (req.body.supplierId == null) {
      return errorHandler.handleError(res, "E0083");
    }
    const result = await platformCompService.updateSupplierViews(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0096", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0012");
  }
};

module.exports = {
  submitReview,
  getComplaintsRetailer,
  getComplaintById,
  getQuotationSupplierComplaint,
  getQuotationRetailerComplaint,
  getComplaintTypes,
  createComplaint,
  getComplaintsSupplier,
  getComplaintsList,
  searchComplaints,
  updateComplaint,
  getPenalties,
  viewPenalty,
  addPenalty,
  deletePenalty,
  searchPenalties,
  getPenaltyTypes,
  updateSupplierViews,
};
