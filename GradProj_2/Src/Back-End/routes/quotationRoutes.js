// Routes for quotation handling
const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationController");
const validateToken = require("../middlewares/validateToken");
router.post("/request", validateToken, controller.requestQuotation);
/*
retailerId
supplierId
quotationDetails: orderList [
{
 productId:
 quantity:
}
]
,
retailerEstablishmentName
supplierEstablishmentName
shippingAddress
billingAddress
*/
module.exports = router;
