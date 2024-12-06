const User = require("../models/User"); // User model
const Establishment = require("../models/Establishment"); // Establishment model
const Supplier = require("../models/supplier");
const Retailer = require("../models/retailer");
const Admin = require("../models/Adminstrator");
const Factory = require("../models/Factory");
const RetailStore = require("../models/RetailStore");
const Quotation = require("../models/Quotation");
const Order = require("../models/Order");
const logDBModel = require("../models/Log");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const applicationModel = require("../models/Application");
const crypto = require("crypto");
const { sendEmail } = require("../config/email");
const env = require("../config/env");
const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");
const userService = require("../services/userService");
const quotationService = {
  async requestQuotation(inputData) {
    await beginTransaction();
    const quotationDetails = {
      requesterId: inputData.retailerId,
      supplierId: inputData.supplierId,
      quotationStatusId: 1,
      quotationRequestDate: "2024-11-19 19:19:03.295244",
      quotationDetails: inputData.quotationDetails,
      quotationAttachments: null,
      fromEstablishmentName: inputData.retailerEstablishmentName,
      toEstablishmentName: inputData.supplierEstablishmentName,
      shipToAddress: inputData.shippingAddress,
      billToAddress: inputData.billingAddress,
      supplierAddress: null,
      lastModifiedBy: 1,
      shippingCost: null,
      subTotal: null,
      total: null,
    };
    quotationInsertDb = await Quotation.insertQuotation(quotationDetails);
    if (
      !quotationInsertDb[0].out_quotation_id ||
      quotationInsertDb[0].out_quotation_id == "-1"
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Create Quotation",
      };
    }
    if (inputData.quotationDetails) {
       for (let i = 0; i < inputData.quotationDetails.detailsItem.length; i++) {
         try {
           const orderItem = {
             quotationId: quotationInsertDb[0].out_quotation_id,
             productId: inputData.quotationDetails.detailsItem[i].productId,
             orderQuantity: inputData.quotationDetails.detailsItem[i].quantity,
             orderPrice:
               inputData.quotationDetails.detailsItem[i].price || null,
             lastModifiedBy: quotationInsertDb[0].out_quotation_id,
           };
           const orderResDB = await Order.insertOrder(orderItem);
           if (
             !orderResDB[0].out_order_id ||
             orderResDB[0].out_order_id == "-1"
           ) {
             await rollbackTransaction();
             return {
               success: false,
               error: "Failed to Create Quotation Details",
             };
           }
         } catch {
           await rollbackTransaction();
           return {
             success: false,
             error: "Failed to Create Quotation Details",
           };
         }
       }
    }
    await commitTransaction();
    return {
      success: true,
    };
  },
};
module.exports = quotationService;
