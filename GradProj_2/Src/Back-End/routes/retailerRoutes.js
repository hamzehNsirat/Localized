// Routes to load different user dashboards
const express = require("express");
const router = express.Router();
const controller = require("../controllers/retailerController");
const validateToken = require("../middlewares/validateToken");
// Retailer Routes
// Get Basic Marketplace 
router.post(
  "/getretmarketplaceproducts",
  validateToken,
  controller.getRetMarketplaceProducts
);
// Search Market Place by Categories / Industry Types
router.post(
  "/getretproductsbycategory",
  validateToken,
  controller.getRetProductsByCategory
);
// Search Market Place by search term : product name, factory name, categories, industry types .. etc
router.post(
  "/searchretproducts",
  validateToken,
  controller.searchRetProducts
);
// Visit Supplier Page
router.post("/getretsupplierproducts", validateToken, controller.getRetSupplierProducts);
module.exports = router;
