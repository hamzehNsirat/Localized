// Quotation endpoints
const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationController");
const validateToken = require("../middlewares/validateToken");
/*
const validateRequest = require("../middlewares/validationMiddlewares");
const schemas = require("../config/schemas");
router.post("/login", validateRequest(schemas.login), controller.signIn);
*/
// General Routes
router.post("/updatestatus", validateToken, controller.updateQuotationStatus);
router.post("/getbyid", validateToken, controller.getQuotationById);
// Retailer Routes
router.post("/request", validateToken, controller.requestQuotation);
router.post("/getbyretailer", validateToken, controller.getQuotationByRetailer);
module.exports = router;
