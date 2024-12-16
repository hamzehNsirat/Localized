// Dashboard endpoints
const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");
const validateToken = require("../middlewares/validateToken");
/*
const validateRequest = require("../middlewares/validationMiddlewares");
const schemas = require("../config/schemas");
router.post("/login", validateRequest(schemas.login), controller.signIn);
*/
// Retailer Routes
router.post(
  "/getretailerdetails",
  validateToken,
  controller.getRetailerAllDetails
);
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
// Supplier Routes
router.post(
  "/getsupplierdetails",
  validateToken,
  controller.getSupplierAllDetails
);
router.post(
  "/getsuppliernotifications",
  validateToken,
  controller.getSupplierNotifications
);
router.post(
  "/updatesupplierdetails", 
  validateToken,
  controller.updateSupplierDetails
);
router.post(
  "/updatefactorydetails",
  validateToken,
  controller.updateFactoryDetails
);
// Admin Routes
router.post(
  "/getadmindetails",
  validateToken,
  controller.getAdminAllDetails
);
module.exports = router;
