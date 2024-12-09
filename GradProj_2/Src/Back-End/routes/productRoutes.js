// Product endpoints
const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const validateToken = require("../middlewares/validateToken");
/*
const validateRequest = require("../middlewares/validationMiddlewares");
const schemas = require("../config/schemas");
router.post("/login", validateRequest(schemas.login), controller.signIn);
*/
// Retailer Routes
router.post(
  "/getretmarketplaceproducts",
  validateToken,
  controller.getRetMarketplaceProducts
);
router.post(
  "/getretproductsbycategory",
  validateToken,
  controller.getRetProductsByCategory
);
router.post(
  "/searchretproducts",
  validateToken,
  controller.searchRetProducts
);
router.post("/getretsupplierproducts", validateToken, controller.getRetSupplierProducts);
module.exports = router;
