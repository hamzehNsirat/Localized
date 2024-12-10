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
  "/getretsupplierproducts",
  validateToken,
  controller.getRetSupplierProducts
);
router.post("/searchretproducts", validateToken, controller.searchProducts);
// Supplier Routes
router.post(
  "/getsuppliermarketplace",
  validateToken,
  controller.getSupplierMarketplace
);
router.post("/searchsuppproducts", validateToken, controller.searchProducts);
router.post(
  "/getsupplierownedproducts",
  validateToken,
  controller.getSupplierOwnedProducts
);
router.post("/add", validateToken, controller.addProduct);
router.post("/update", validateToken, controller.updateProduct);

module.exports = router;
