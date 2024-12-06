// Routes for quotation handling
const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationController");
const validateToken = require("../middlewares/validateToken");
router.post("/request", validateToken, controller.requestQuotation);
router.post("/getbyretailer", validateToken, controller.getQuotationByRetailer);
router.post("/getbyid", validateToken, controller.getQuotationById);
router.post("/updatestatus", validateToken, controller.updateQuotationStatus);
module.exports = router;
