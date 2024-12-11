const Supplier = require("../models/Supplier");
const Quotation = require("../models/Quotation");
const Notification = require("../models/Notification");
const Order = require("../models/Order");
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
    console.log("here");
    const quotationDetails = {
      requesterId: inputData.retailerId,
      supplierId: inputData.supplierId,
      quotationStatusId: 1,
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
    const details = inputData.quotationDetails;
    if (inputData.quotationDetails) {
      for (let i = 0; i < inputData.quotationDetails.detailsItem.length; i++) {
        try {
          const orderItem = {
            quotationId: quotationInsertDb[0].out_quotation_id,
            productId: inputData.quotationDetails.detailsItem[i].productId,
            orderQuantity: inputData.quotationDetails.detailsItem[i].quantity,
            orderPrice: inputData.quotationDetails.detailsItem[i].price || null,
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
          details.detailsItem[i].orderId = orderResDB[0].out_order_id;
        } catch {
          await rollbackTransaction();
          return {
            success: false,
            error: "Failed to Create Quotation Details",
          };
        }
      }
    }
    const updatedQuotation = {
      quotationId: quotationInsertDb[0].out_quotation_id,
      quotationDetails: details,
      quotationAttachments: null,
      shippingCost: null,
      subTotal: null,
      total: null,
    };
    quotationUpdateDb =
      await Quotation.updateQuotationDetails(updatedQuotation);
    if (!quotationUpdateDb || quotationUpdateDb[0].update_res === -1) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Update Details in Quotation",
      };
    }
    await commitTransaction();
    const user = await executeQuery(
      "SELECT supplier_user_id FROM supplier WHERE supplier_id = $1",
      [inputData.supplierId]
    );
    notificationData = {
      notificationType: 8,
      notifiedUserId: user[0].supplier_user_id,
      notificationPriority: 1,
      notificationSubject: "New Quotation Requested",
      notificationDetails: `a New Quotation has been Requested, Quotation ID: ${quotationInsertDb[0].out_quotation_id}`,
      lastModifiedBy: 1,
    };
    await Notification.insertNotification(notificationData);

    return {
      success: true,
    };
  },
  async getQuotationByRetailer(inputData) {
    quotationFetchDb = await Quotation.getQuotationsByRetailer(
      inputData.retailerId,
      inputData.pageSize,
      inputData.pageIndex
    );
    if (!quotationFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Quotations",
      };
    }
    const quotationsList = { quotationItem: [] };
    for (let i = 0; i < quotationFetchDb.length; i++) {
      const item = {
        id: quotationFetchDb[i].out_quotation_id,
        logo: quotationFetchDb[i].out_supplier_establishment_logo,
        factoryName: quotationFetchDb[i].out_supplier_establishment_name,
        status: quotationFetchDb[i].out_quotation_status,
      };
      quotationsList.quotationItem.push(item);
    }
    return {
      success: true,
      quotationsList,
    };
  },
  async getQuotationById(inputData) {
    quotationFetchDb = await Quotation.getAllData(inputData.quotationId);
    if (!quotationFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Quotations",
      };
    }
    return {
      success: true,
      quotationDetails: {
        id: quotationFetchDb[0].out_quotation_id,
        requesterId: quotationFetchDb[0].out_requester_id,
        supplierId: quotationFetchDb[0].out_supplier_id,
        retailStore: quotationFetchDb[0].out_from_establishment_name,
        factory: quotationFetchDb[0].out_to_establishment_name,
        requestDate: quotationFetchDb[0].out_quotation_request_date,
        statusId: quotationFetchDb[0].out_quotation_status_id,
        details: quotationFetchDb[0].out_quotation_details,
        attachments: quotationFetchDb[0].out_quotation_attachments,
        paymentReferenceNumber:
          quotationFetchDb[0].out_related_payment_referenece_no,
        reconciliationNumber:
          quotationFetchDb[0].out_related_payment_reconciliation_no,
        latestTransactionID:
          quotationFetchDb[0].out_related_payment_latest_trx_id,
        shippingCost: quotationFetchDb[0].out_shipping_cost,
        subTotal: quotationFetchDb[0].out_sub_total,
        total: quotationFetchDb[0].out_total,
        shipToAddress: quotationFetchDb[0].out_ship_to_address,
        billToAddress: quotationFetchDb[0].out_bill_to_address,
        factoryAddress: quotationFetchDb[0].out_supplier_address,
        hasRelatedComplaints: quotationFetchDb[0].out_has_related_complaints,
      },
    };
  },
  async updateQuotationStatus(inputData) {
    quotationUpdateDb = await Quotation.updateStatus(inputData);
    if (
      !quotationUpdateDb[0] ||
      quotationUpdateDb[0].quotation_update_status == "-1"
    ) {
      return {
        success: false,
        error: "Failed to Update Quotation Status",
      };
    }
    return {
      success: true,
    };
  },
  async getQuotationBySupplier(inputData) {
    quotationFetchDb = await Quotation.getQuotationsBySupplier(
      inputData.supplierId,
      inputData.pageSize,
      inputData.pageIndex
    );
    if (!quotationFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Quotations",
      };
    }
    const quotationsList = { quotationItem: [] };
    for (let i = 0; i < quotationFetchDb.length; i++) {
      const item = {
        id: quotationFetchDb[i].out_quotation_id,
        logo: quotationFetchDb[i].out_supplier_establishment_logo,
        retailStoreName: quotationFetchDb[i].out_supplier_establishment_name,
        status: quotationFetchDb[i].out_quotation_status,
      };
      quotationsList.quotationItem.push(item);
    }
    return {
      success: true,
      quotationsList,
    };
  },
  async submitQuotation(inputData) {
    await beginTransaction();
    const quotationDetails = {
      quotationId: inputData.quotationId,
      quotationDetails: inputData.details,
      quotationAttachments: inputData.quotationAttachments,
      shippingCost: inputData.shippingCost,
      subTotal: inputData.subTotal,
      total: inputData.total,
    };
    quotationUpdateDb =
      await Quotation.updateQuotationDetails(quotationDetails);
    if (
      !quotationUpdateDb ||
      quotationUpdateDb[0].quotation_update_details === -1
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Update Quotation",
      };
    }
    if (inputData.details) {

      for (let i = 0; i < inputData.details.detailsItem.length; i++) {
        try {
          const orderItem = {
            orderId: parseInt(inputData.details.detailsItem[i].orderId),
            orderQuantity: inputData.details.detailsItem[i].quantity,
            orderPrice: inputData.details.detailsItem[i].price || null,
            lastModifiedBy: inputData.quotationId,
          };

          const orderResDB = await Order.updateOrder(orderItem);
          if (!orderResDB || orderResDB[0].order_update === -1) {
            await rollbackTransaction();
            return {
              success: false,
              error: "Failed to Update Quotation Details",
            };
          }
        } catch (err){
          await rollbackTransaction();
          return {
            success: false,
            error: "Failed to Update Quotation Details: " + err,
          };
        }
      }
    }
    await commitTransaction();
    const user = await executeQuery(
      "SELECT retailer_user_id FROM retailer WHERE retailer_id = (SELECT requester_id FROM quotation WHERE quotation_id = $1)",
      [inputData.quotationId]
    );
    notificationData = {
      notificationType: 9,
      notifiedUserId: user[0].retailer_user_id,
      notificationPriority: 1,
      notificationSubject: "Quotation has been Submitted By Supplier",
      notificationDetails: `Quotation with ID: ${inputData.quotationId} has been Submitted by Supplier, Click to view Details`,
      lastModifiedBy: 1,
    };
    await Notification.insertNotification(notificationData);
    return {
      success: true,
    };
  },
};
module.exports = quotationService;
