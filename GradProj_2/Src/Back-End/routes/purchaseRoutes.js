// Purchase endpoints
const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseController");
const validateToken = require("../middlewares/validateToken");
/*
const validateRequest = require("../middlewares/validationMiddlewares");
const schemas = require("../config/schemas");
router.post("/login", validateRequest(schemas.login), controller.signIn);
*/
// Retailer Routes
router.post("/create", validateToken, controller.createPurchase);
module.exports = router;
