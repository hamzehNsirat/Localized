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
router.post("/getbyadmin", validateToken, controller.getQuotationList);
router.post("/updatestatus", validateToken, controller.updateQuotationStatus);
router.post("/getbyid", validateToken, controller.getQuotationById);
router.post("/search", validateToken, controller.searchQuotations);
// Retailer Routes
router.post("/request", validateToken, controller.requestQuotation);
router.post("/getbyretailer", validateToken, controller.getQuotationByRetailer);
// Supplier Routes
router.post("/getbysupplier", validateToken, controller.getQuotationBySupplier);
router.post("/submit", validateToken, controller.submitQuotation);

module.exports = router;
