// Routes to load different user dashboards
const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");
const validateToken = require("../middlewares/validateToken");
// Retailer Routes
router.post("/getretailerdetails", validateToken, controller.getRetailerAllDetails);
router.post(
  "/updateretailerdetails",
  validateToken,
  controller.updateRetailerDetails
);
router.post(
  "/updateretailstoredetails",
  validateToken,
  controller.updateRetailstoreDetails
);

router.post(
  "/getretailernotifications",
  validateToken,
  controller.getRetailerNotifications
);
module.exports = router;
