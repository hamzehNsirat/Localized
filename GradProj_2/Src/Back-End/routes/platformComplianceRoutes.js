//  Platform Compliance Management routes
const express = require("express");
const router = express.Router();
const controller = require("../controllers/platformComplianceController");
const validateToken = require("../middlewares/validateToken");
// Retailer Routes
router.post("/submitreview", validateToken, controller.submitReview);
module.exports = router;
