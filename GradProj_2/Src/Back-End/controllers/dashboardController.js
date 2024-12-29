// Controls the Route / Service Interaction for the following:
/*
-----------------------
-- RETAILER DASHBOARD--
- Get Retailer Details (Basic, Retailer Related, Retailstore)
- Get Retailer Notifications
- Update Retailer Details
- Update Retailstore Details
------------------------
-- SUPPLIER DASHBOARD --
- Get Supplier Details (Basic, Supplier Related, Retailstore)
- Get Supplier Notifications
- Update Supplier Details
- Update Factory Details
----------------------------
-- Adminstrator DASHBOARD --
- Get Adminstrator Details (Basic, Adminstrator Related, Retailstore)
- Get Adminstrator Notifications
*/
const dashboardService = require("../services/dashboardService");
const errorHandler = require("../middlewares/errorHandler");
// RetailerDashboard
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
const updateRetailerDetails = async (req, res) => {
  try {
    if (req.body.retailerId == null) {
      return errorHandler.handleError(res, "E0065");
    }
    const result = await dashboardService.updateRetailerDetails(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0066", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0066");
  }
};
const updateRetailstoreDetails = async (req, res) => {
  try {
    if (req.body.retailerId == null) {
      return errorHandler.handleError(res, "E0065");
    }
    const result = await dashboardService.updateRetailstoreDetails(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0067", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0067");
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
    const result = await dashboardService.getRetailerNotifications(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0064", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0064");
  }
};
// SupplierDashboard
const getSupplierAllDetails = async (req, res) => {
  try {
    if (req.body.userId == null) {
      return errorHandler.handleError(res, "E0068");
    }
    const result = await dashboardService.getSupplierAllDetails(
      req.body.userId
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0069", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0069");
  }
};
const getSupplierNotifications = async (req, res) => {
  try {
    if (
      req.body.userId == null ||
      req.body.pageSize == null ||
      req.body.pageIndex == null
    ) {
      return errorHandler.handleError(res, "E0063");
    }
    const result = await dashboardService.getSupplierNotifications(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0064", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0064");
  }
};
const updateSupplierDetails = async (req, res) => {
  try {
    if (req.body.supplierId == null) {
      return errorHandler.handleError(res, "E0083");
    }
    const result = await dashboardService.updateSupplierDetails(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0082", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0082");
  }
};
const updateFactoryDetails = async (req, res) => {
  try {
    if (req.body.supplierId == null) {
      return errorHandler.handleError(res, "E0083");
    }
    const result = await dashboardService.updateFactoryDetails(req.body);
    if (result.success == false) {
      return errorHandler.handleError(res, "E0084", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0084");
  }
};
// AdminstratorDashboard
const getAdminAllDetails = async (req, res) => {
  try {
    if (req.body.userId == null) {
      return errorHandler.handleError(res, "E0033");
    }
    const result = await dashboardService.getAdminAllDetails(
      req.body.userId
    );
    if (result.success == false) {
      return errorHandler.handleError(res, "E0085", result);
    }
    return errorHandler.handleSuccess(res, result);
  } catch (error) {
    return errorHandler.handleError(res, "E0085");
  }
};

const readNotif = async (req, res) => {
    const result = await dashboardService.readNotif(req.body.notificationId);
    return errorHandler.handleSuccess(res, result);
};

module.exports = {
  getRetailerAllDetails,
  getRetailerNotifications,
  updateRetailerDetails,
  updateRetailstoreDetails,
  getSupplierAllDetails,
  getSupplierNotifications,
  updateSupplierDetails,
  updateFactoryDetails,
  getAdminAllDetails,
  readNotif,
};