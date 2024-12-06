// Order endpoints for retailers and suppliers
const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseController");
const validateToken = require("../middlewares/validateToken");
router.post("/create", validateToken, controller.createPurchase);
module.exports = router;
