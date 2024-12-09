//  Platform Compliance Management endpoints
const express = require("express");
const router = express.Router();
const controller = require("../controllers/platformComplianceController");
const validateToken = require("../middlewares/validateToken");
/*
const validateRequest = require("../middlewares/validationMiddlewares");
const schemas = require("../config/schemas");
router.post("/login", validateRequest(schemas.login), controller.signIn);
*/
// General Routes
router.post("/getcomplaintbyid", validateToken, controller.getComplaintById);
router.post("/getcomplainttypes", validateToken, controller.getComplaintTypes);
router.post("/createcomplaint", validateToken, controller.createComplaint);
// Retailer Routes
router.post("/submitreview", validateToken, controller.submitReview);
router.post(
  "/getcomplaintsretailer",
  validateToken,
  controller.getComplaintsRetailer
);
router.post(
  "/getquotationactorsret",
  validateToken,
  controller.getQuotationRetailerComplaint
);
// Supplier Routes
router.post(
  "/getquotationactorssupp",
  validateToken,
  controller.getQuotationSupplierComplaint
);
module.exports = router;
