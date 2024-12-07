//  Platform Compliance Management routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/platformComplianceController");
const validateToken = require("../middlewares/validateToken");
// Retailer Routes
router.post("/submitreview", validateToken, controller.submitReview);
router.post(
  "/getcomplaintsretailer",
  validateToken,
  controller.getComplaintsRetailer
);
router.post(
  "/getcomplaintbyid",
  validateToken,
  controller.getComplaintById
);
router.post(
  "/getquotationactorssupp",
  validateToken,
  controller.getQuotationSupplierComplaint
);
router.post(
  "/getquotationactorsret",
  validateToken,
  controller.getQuotationRetailerComplaint
);
router.post("/getcomplainttypes", validateToken, controller.getComplaintTypes);
router.post("/createcomplaint", validateToken, controller.createComplaint);
module.exports = router;
