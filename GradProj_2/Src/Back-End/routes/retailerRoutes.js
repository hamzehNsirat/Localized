// Routes to load different user dashboards
const express = require("express");
const router = express.Router();
const controller = require("../controllers/retailerController");
const validateToken = require("../middlewares/validateToken");
// Retailer Routes
router.post(
  "/getretmarketplaceproducts",
  validateToken,
  controller.getretmarketplaceproducts
);
module.exports = router;
