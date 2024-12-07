// Contains platform-compliance-related logic.
const Supplier = require("../models/Supplier.js");
const Review = require("../models/Review");
const Complaint = require("../models/Complaint");
const ComplaintType = require("../models/ComplaintType");
const Quotation = require("../models/Quotation");
const Notification = require("../models/Notification");

const { sendEmail } = require("../config/email");
const env = require("../config/env");
const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");
const platformComplianceService = {
  async submitReview(inputData) {
    await beginTransaction();
    const reviewDetails = {
      supplierId: inputData.supplierId,
      retailerId: inputData.retailerId,
      rating: inputData.rating,
      reviewComment: inputData.reviewComment,
      reviewDate: null,
      lastModificationDate: null,
      lastModifiedBy: 1,
    };
    const reviewInsertDb = await Review.insert(reviewDetails);
    if (
      !reviewInsertDb[0].out_review_id ||
      reviewInsertDb[0].out_review_id == "-1"
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Submit Review",
      };
    }
    try {
      await Supplier.updateOverallRatingBySupplier(inputData.supplierId);
    } catch {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Calculate Supplier Overall Rating",
      };
    }
    await commitTransaction();
    const user = await executeQuery(
      "SELECT supplier_user_id FROM supplier WHERE supplier_id = $1",
      [inputData.supplierId]
    );
    notificationData = {
      notificationType: 6,
      notifiedUserId: user[0].supplier_user_id,
      notificationPriority: 2,
      notificationSubject: "New Retailer Feedback",
      notificationDetails:
        "a Retailer has Submitted a new Review about your Products",
      lastModifiedBy: 1,
    };
    await Notification.insertNotification(notificationData);

    return {
      success: true,
    };
  },
  async createComplaint(inputData) {
    await beginTransaction();
    const complaintDetails = {
      complaintTitle: inputData.complaintTitle,
      complaintTypeId: inputData.complaintTypeId,
      reviewerId: null,
      supplierId: inputData.supplierId,
      retailerId: inputData.retailerId,
      complaintStatusId: "CREATED",
      complaintNotes: inputData.complaintNotes,
      submitterType: true,
      creationDate: null,
      lastModifiedBy: 1,
      resolutionNotes: null,
      quotationId: inputData.quotationId,
    };
    const complaintInsertDb = await Complaint.insertComplaint(complaintDetails);
    if (
      !complaintInsertDb[0].out_complaint_id ||
      complaintInsertDb[0].out_complaint_id == "-1"
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Create Complaint",
      };
    }
    await commitTransaction();

    const user = await executeQuery(
      "SELECT supplier_user_id FROM supplier WHERE supplier_id = $1",
      [inputData.supplierId]
    );
    const userB = await executeQuery(
      "SELECT retailer_user_id FROM retailer WHERE retailer_id = $1",
      [inputData.retailerId]
    );
    notificationData = {
      notificationType: 7,
      notifiedUserId: user[0].supplier_user_id,
      notificationPriority: 1,
      notificationSubject: "New Complaint Submitted",
      notificationDetails: `a Complaint has been Submitted regarding this Quotation: ${inputData.quotationId}`,
      lastModifiedBy: 1,
    };
    await Notification.insertNotification(notificationData);

    notificationData = {
      notificationType: 7,
      notifiedUserId: userB[0].retailer_user_id,
      notificationPriority: 1,
      notificationSubject: "New Complaint Submitted",
      notificationDetails: `a Complaint has been Submitted regarding this Quotation: ${inputData.quotationId}`,
      lastModifiedBy: 1,
    };
    await Notification.insertNotification(notificationData);

    return {
      success: true,
    };
  },
  async getComplaintsRetailer(inputData) {
    const complaintsFetchDb = await Complaint.getComplaintsByRetailer(
      inputData.retailerId,
      inputData.pageSize,
      inputData.pageIndex
    );
    if (!complaintsFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Complaints",
      };
    }
    const complaintsList = { complaintItem: [] };
    for (let i = 0; i < complaintsFetchDb.length; i++) {
      const item = {
        id: complaintsFetchDb[i].complaint_id,
        title: complaintsFetchDb[i].complaint_title,
        date: complaintsFetchDb[i].complaint_date,
        status: complaintsFetchDb[i].complaint_status,
      };
      complaintsList.complaintItem.push(item);
    }
    return {
      success: true,
      complaintsList,
    };
  },

  async getComplaintById(inputData) {
    const complaintFetchDb = await Complaint.getComplaintById(
      inputData.complaintId
    );
    if (!complaintFetchDb) {
      return {
        success: false,
        error: "Failed to Fetch Complaint Details",
      };
    }
    const complaintDetails = {
      id: complaintFetchDb.out_complaint_id,
      title: complaintFetchDb.out_complaint_title,
      type: complaintFetchDb.out_complaint_type_id,
      quotationId: complaintFetchDb.out_quotation_id,
      reviewerId: complaintFetchDb.out_reviewer_id,
      supplierId: complaintFetchDb.out_supplier_id,
      retailerId: complaintFetchDb.out_retailer_id,
      complaintNotes: complaintFetchDb.out_complaint_notes,
      complaintStatus: complaintFetchDb.out_complaint_status_id,
      submitterType:
        complaintFetchDb.out_submitter_type == true ? "RETAILER" : "SUPPLIER",
      creationDate: complaintFetchDb.out_creation_date,
      resolutionNotes: complaintFetchDb.out_resolution_notes,
      isResolved:
        complaintFetchDb.out_complaint_status_id == "RESOLVED" ? true : false,
    };
    return {
      success: true,
      complaintDetails,
    };
  },

  async getQuotationSupplierComplaint(inputData) {
    const actorFetchDb = await Quotation.getQuotationActorsSupplier(
      inputData.supplierId
    );
    if (!actorFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Quotation Actors",
      };
    }
    const quotationActors = { quotationItem: [] };
    for (let i = 0; i < actorFetchDb.length; i++) {
      const item = {
        quotationId: actorFetchDb[i].quotation_id,
        supplierId: actorFetchDb[i].supplier_id,
        retailerId: actorFetchDb[i].requester_id,
      };
      quotationActors.quotationItem.push(item);
    }
    return {
      success: true,
      quotationActors,
    };
  },

  async getQuotationRetailerComplaint(inputData) {
    const actorFetchDb = await Quotation.getQuotationActorsRetailer(
      inputData.retailerId
    );
    if (!actorFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Quotation Actors",
      };
    }
    const quotationActors = { quotationItem: [] };
    for (let i = 0; i < actorFetchDb.length; i++) {
      const item = {
        quotationId: actorFetchDb[i].quotation_id,
        supplierId: actorFetchDb[i].supplier_id,
        retailerId: actorFetchDb[i].requester_id,
      };
      quotationActors.quotationItem.push(item);
    }
    return {
      success: true,
      quotationActors,
    };
  },

  async getComplaintTypes() {
    const typesFetchDb = await ComplaintType.getAllComplaintTypes();
    if (!typesFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Complaint Types",
      };
    }
    const complaintTypes = typesFetchDb.map((record) => ({
      id: record.cmplaint_type_id,
      type: record.cmplaint_type,
    }));
    return {
      success: true,
      complaintTypes,
    };
  },
};
module.exports = platformComplianceService;