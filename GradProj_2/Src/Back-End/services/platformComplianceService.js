// Contains platform-compliance-related logic.
const Supplier = require("../models/Supplier.js");
const Review = require("../models/Review");
const Complaint = require("../models/Complaint");
const Penalty = require("../models/Penalty.js");
const PenaltyType = require("../models/PenaltyType.js");
const ComplaintType = require("../models/ComplaintType");
const Quotation = require("../models/Quotation");
const {
  sendEmail,
  submitNotification,
} = require("../config/notificationUtils.js");
const env = require("../config/env");
const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");
const platformComplianceService = {
  async updateSupplierViews(inputData) {
    await Supplier.updateProfileViewsSupplier(
      inputData.supplierId
    );
    return {
      success: true,
    };
  },
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
      quotationId: inputData.quotationId,
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
    await submitNotification(
      6,
      user[0].supplier_user_id,
      2,
      "New Retailer Feedback",
      "a Retailer has Submitted a new Review about your Products"
    );
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
      submitterType: inputData.submitterType,
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

    await submitNotification(
      7,
      user[0].supplier_user_id,
      1,
      "New Complaint Submitted",
      `a Complaint has been Submitted regarding this Quotation: ${inputData.quotationId}`
    );

    await submitNotification(
      7,
      userB[0].retailer_user_id,
      1,
      "New Complaint Submitted",
      `a Complaint has been Submitted regarding this Quotation: ${inputData.quotationId}`
    );

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
      supplier: {
        Id: complaintFetchDb.out_supplier_id,
        FullName: complaintFetchDb.out_supp_full_name,
        EstablishmentId: complaintFetchDb.out_supp_establishment_id,
        EstablishmentName: complaintFetchDb.out_supp_Establishment,
        EstablishmentEmail: complaintFetchDb.out_supp_email,
        EstablishmentContact: complaintFetchDb.out_supp_contact,
      },
      retailer: {
        Id: complaintFetchDb.out_retailer_id,
        EstablishmentId: complaintFetchDb.out_ret_establishment_id,
        FullName: complaintFetchDb.out_ret_full_name,
        EstablishmentName: complaintFetchDb.out_ret_Establishment,
        EstablishmentEmail: complaintFetchDb.out_ret_email,
        EstablishmentContact: complaintFetchDb.out_ret_contact,
      },
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
  async getComplaintsSupplier(inputData) {
    const complaintsFetchDb = await Complaint.getComplaintsBySupplier(
      inputData.supplierId,
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
  async getComplaintsList(inputData) {
    const complaintsFetchDb = await Complaint.getAllComplaints(
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
        id: complaintsFetchDb[i].out_complaint_id,
        title: complaintsFetchDb[i].out_complaint_title,
        date: complaintsFetchDb[i].out_creation_date,
        status: complaintsFetchDb[i].out_complaint_status_id,
      };
      complaintsList.complaintItem.push(item);
    }
    return {
      success: true,
      complaintsList,
    };
  },
  async searchComplaints(inputData) {
    const complaintsFetchDb = await Complaint.searchComplaints(
      inputData.searchTerm,
      inputData.pageSize,
      inputData.pageIndex
    );
    if (!complaintsFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Search Complaints",
      };
    }
    const complaintsList = { complaintItem: [] };
    for (let i = 0; i < complaintsFetchDb.length; i++) {
      const item = {
        id: complaintsFetchDb[i].out_complaint_id,
        title: complaintsFetchDb[i].out_complaint_title,
        date: complaintsFetchDb[i].out_creation_date,
        status: complaintsFetchDb[i].out_complaint_status_id,
      };
      complaintsList.complaintItem.push(item);
    }
    return {
      success: true,
      complaintsList,
    };
  },
  async updateComplaint(inputData) {
    const complaintsUpdateDb = await Complaint.updateComplaint(
      inputData.reviewerId,
      inputData.complaintStatusId,
      1,
      inputData.resolutionNotes,
      inputData.complaintId
    );
    if (!complaintsUpdateDb || complaintsUpdateDb[0].update_res === -1) {
      return {
        success: false,
        error: "Failed to Update Complaint",
      };
    }

    const user = await executeQuery(
      "SELECT supplier_user_id FROM supplier WHERE supplier_id = (SELECT supplier_id FROM complaint WHERE complaint_id = $1)",
      [inputData.complaintId]
    );
    const userB = await executeQuery(
      "SELECT retailer_user_id FROM retailer WHERE retailer_id = (SELECT retailer_id FROM complaint WHERE complaint_id = $1)",
      [inputData.complaintId]
    );

    await submitNotification(
      11,
      user[0].supplier_user_id,
      1,
      "Complaint Resolved",
      `Complaint has been Resolved with Resolution Notes: ${inputData.resolutionNotes}`
    );

    await submitNotification(
      11,
      userB[0].retailer_user_id,
      1,
      "Complaint Resolved",
      `Complaint has been Resolved with Resolution Notes: ${inputData.resolutionNotes}`
    );

    return {
      success: true,
    };
  },
  async getPenalties(inputData) {
    const penaltiesFetchDb = await Penalty.getAllPenalties(
      inputData.pageSize,
      inputData.pageIndex
    );
    if (!penaltiesFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Penalties",
      };
    }
    const penaltiesList = { penaltyItem: [] };
    for (let i = 0; i < penaltiesFetchDb.length; i++) {
      const item = {
        id: penaltiesFetchDb[i].out_penalty_id,
        title: penaltiesFetchDb[i].out_penalty_title,
        date: penaltiesFetchDb[i].out_creation_date,
        status: penaltiesFetchDb[i].out_penalty_status_id,
      };
      penaltiesList.penaltyItem.push(item);
    }
    return {
      success: true,
      penaltiesList,
    };
  },
  async searchPenalties(inputData) {
    const penaltiesFetchDb = await Penalty.searchPenalties(
      inputData.searchTerm,
      inputData.pageSize,
      inputData.pageIndex
    );
    if (!penaltiesFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Search Penalties",
      };
    }
    const penaltiesList = { penaltyItem: [] };
    for (let i = 0; i < penaltiesFetchDb.length; i++) {
      const item = {
        id: penaltiesFetchDb[i].out_penalty_id,
        title: penaltiesFetchDb[i].out_penalty_title,
        date: penaltiesFetchDb[i].out_creation_date,
        status: penaltiesFetchDb[i].out_penalty_status_id,
      };
      penaltiesList.penaltyItem.push(item);
    }
    return {
      success: true,
      penaltiesList,
    };
  },
  async viewPenalty(inputData) {
    const penaltiesFetchDb = await Penalty.getPenaltyById(inputData.penaltyId);
    if (!penaltiesFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Penalty Details",
      };
    }
    const penaltyDetails = {
      title: penaltiesFetchDb[0].out_penalty_title,
      typeId: penaltiesFetchDb[0].out_penalty_type_id,
      establishmentType: penaltiesFetchDb[0].out_establishment_type,
      initiatorId: penaltiesFetchDb[0].out_penalty_initiator_id,
      statusId: penaltiesFetchDb[0].out_penalty_status_id,
      notes: penaltiesFetchDb[0].out_penalty_notes,
      creationDate: penaltiesFetchDb[0].out_creation_date,
      weight: penaltiesFetchDb[0].out_penalty_weight,
      relatedComplaintId: penaltiesFetchDb[0].out_related_complaint_id,
      supplier: {
        supplierId: penaltiesFetchDb[0].out_supplier_id,
        establishmentId: penaltiesFetchDb[0].out_sup_establishment_id,
        establishmentName: penaltiesFetchDb[0].out_sup_establishment_name,
      },
      retailer: {
        retailerId: penaltiesFetchDb[0].out_retailer_id,
        establishmentId: penaltiesFetchDb[0].out_ret_establishment_id,
        establishmentName: penaltiesFetchDb[0].out_ret_establishment_name,
      },
    };
    return {
      success: true,
      penaltyDetails: penaltyDetails,
    };
  },
  async getPenaltyTypes(inputData) {
    const typesFetchDb = await PenaltyType.getAllPenaltyTypes();
    if (!typesFetchDb[0]) {
      return {
        success: false,
        error: "Failed to Fetch Penalty Types",
      };
    }
    const penaltyTypes = typesFetchDb.map((record) => ({
      id: record.penlty_type_id,
      type: record.penlty_type,
    }));
    return {
      success: true,
      penaltyTypes: penaltyTypes,
    };
  },
  async addPenalty(inputData) {
    await beginTransaction();
    const insertData = {
      penaltyTypeId: inputData.penaltyTypeId,
      establishmentId: inputData.establishmentId,
      penaltyInitiatorId: inputData.penaltyInitiatorId,
      penaltyStatusId: "APPLIED",
      penaltyNotes: inputData.penaltyNotes,
      lastModifiedBy: 1,
      penaltyTitle: inputData.penaltyTitle,
      penaltyWeight: inputData.penaltyWeight,
      relatedComplaintId: inputData.relatedComplaintId,
    };
    const penaltyInsertDb = await Penalty.insertPenalty(insertData);
    if (
      !penaltyInsertDb[0].out_penalty_id ||
      penaltyInsertDb[0].out_penalty_id == "-1"
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Create Penalty",
      };
    }
    await commitTransaction();
    const respondant = await executeQuery(
      "SELECT submitter_type FROM complaint WHERE complaint_id = $1",
      [inputData.relatedComplaintId]
    );
    let tryOwner = {};
    if (respondant[0].submitter_type == true) {
      tryOwner = await executeQuery(
        "SELECT user_email, user_id FROM user_localized WHERE user_id = (SELECT supplier_user_id FROM supplier WHERE supplier_id = (SELECT owner_id FROM factory WHERE factory_est_id = $1))",
        [inputData.establishmentId]
      );
      await submitNotification(
        12,
        tryOwner[0]?.user_id,
        0,
        "Penalty Applied",
        `Penalty is Applied to your Factory, Contact Us for more details`
      );
    } else {
      tryOwner = await executeQuery(
        "SELECT user_email, user_id FROM user_localized WHERE user_id = (SELECT retailer_user_id FROM retailer WHERE retailer_id = (SELECT owner_id FROM retailstore WHERE retailstore_est_id = $1))",
        [inputData.establishmentId]
      );
      await submitNotification(
        12,
        tryOwner[0]?.user_id,
        0,
        "Penalty Applied",
        `Penalty is Applied to your Retailstore, Contact Us for more details`
      );
    }
    await sendEmail(
      tryOwner[0]?.user_email,
      "Penalty Application | Localized",
      `Penalty: ${penaltyInsertDb[0].out_penalty_id} with Title: ${inputData.penaltyTitle} has been Applied to your Establishment, kindly check the platform for more information`,
      `<h4>Penalty: ${penaltyInsertDb[0].out_penalty_id} with Title: ${inputData.penaltyTitle} has been Applied to your Establishment, kindly check the platform for more information</h4>`
    );
    return {
      success: true,
    };
  },
  async deletePenalty(inputData) {
    await beginTransaction();
    // NOTIF HANDLING
    const respondant = await executeQuery(
      "SELECT submitter_type, supplier_id, retailer_id FROM complaint WHERE complaint_id = (SELECT related_complaint_id FROM penalty WHERE penalty_id = $1)",
      [inputData.penaltyId]
    );

    const penaltyDeleteDb = await Penalty.deletePenalty(inputData.penaltyId);
    if (!penaltyDeleteDb[0].result || penaltyDeleteDb[0].result != "0") {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Delete Penalty",
      };
    }
    await commitTransaction();

    let tryOwner = {};
    if (respondant[0].submitter_type == true) {
      tryOwner = await executeQuery(
        "SELECT user_email, user_id FROM user_localized WHERE user_id = (SELECT supplier_user_id FROM supplier WHERE supplier_id =  $1)",
        [respondant[0].supplier_id]
      );

      await submitNotification(
        12,
        tryOwner[0].user_id,
        0,
        "Penalty Applied",
        `Penalty is Disabled on your Factory, Contact Us for more details`
      );
    } else {
      tryOwner = await executeQuery(
        "SELECT user_email, user_id FROM user_localized WHERE user_id = (SELECT retailer_user_id FROM retailer WHERE retailer_id = $1)",
        [respondant[0].retailer_id]
      );
      await submitNotification(
        12,
        tryOwner[0].user_id,
        0,
        "Penalty Applied",
        `Penalty is Disabled on your Retailstore, Contact Us for more details`
      );
    }
    await sendEmail(
      tryOwner[0]?.user_email,
      "Penalty Deletion | Localized",
      `Penalty: ${inputData.penaltyId} has been  Alleviated from your Establishment, kindly check the platform for more information`,
      `<h4>Penalty: ${inputData.penaltyId} has been Alleviated from your Establishment, kindly check the platform for more information</h4>`
    );
    return {
      success: true,
    };
  },
};
module.exports = platformComplianceService;
