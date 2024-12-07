const User = require("../models/User"); // User model
const Establishment = require("../models/Establishment"); // Establishment model
const Supplier = require("../models/Supplier");
const Retailer = require("../models/retailer");
const Admin = require("../models/Adminstrator");
const Factory = require("../models/Factory");
const RetailStore = require("../models/RetailStore");
const logDBModel = require("../models/Log");
const Notification = require("../models/Notification");
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

const dashboardService = {
  async getRetailerAllDetails(userId) {
    const input = {
      userId: userId,
    };
    // Fetch Data from each table
    const basicData = await userService.getUserById(input);
    const retailerData = await Retailer.getRetailerByUserId(userId);
    const retailStoreData = await RetailStore.getOwnedRetailStores(
      retailerData[0].out_retailer_id
    );
    const establishmentData = await Establishment.getEstablishmentById(
      retailStoreData[0].retailstore_est_id
    );
    const progressBarRetailer =
      await Retailer.calculateCompletionPercentage(userId);
    const progressBarRetailstore =
      await Retailer.calculateEstablishmentCompletionPercentage(
        retailerData[0].out_retailer_id
      );
    const retailerInsights = { Insights: "To Be Done" };
    // Consilidate Data and Format it
    const retailerDashboard = {
      userDetails: {
        nationalNumber: basicData.nationalNumber,
        userName: basicData.userName,
        userType: basicData.userType,
        userStatus: basicData.userStatus,
        firstName: basicData.firstName,
        middleName: basicData.middleName,
        lastName: basicData.lastName,
        dateOfBirth: basicData.dateOfBirth,
        userEmail: basicData.userEmail,
        userPhone: basicData.userPhone,
        userAddress: basicData.userAddress,
        userImage: basicData.userImage,
      },
      retailerDetails: {
        retailerId: retailerData[0].out_retailer_id,
        retailerTaxIdentificationNumber:
          retailerData[0].out_retailer_tax_identification_num,
        retailerBankAccountNumber:
          retailerData[0].out_retailer_bank_account_num,
        retailerIBAN: retailerData[0].out_retailer_iban,
        retailerComplianceIndicator:
          retailerData[0].out_retailer_compliance_indicator,
        retailerComplaintCount: retailerData[0].out_retailer_complaint_count,
      },
      retailStoreDetails: {
        retailStoreId:
          retailStoreData[0].retailstore_est_id +
          "-" +
          retailerData[0].out_retailer_id,
      },
      establishmentDetails: {
        establishmentName: establishmentData[0].out_establishment_name,
        establishmentIndustryType: establishmentData[0].out_industry_type,
        establishmentStatus: establishmentData[0].out_establishment_status,
        establishmentCommercialRegistrationNumber:
          establishmentData[0].out_commercial_registration_num,
        establishmentRegistrationDate:
          establishmentData[0].out_establishment_registration_date,
        establishmentCommercialRegistrationNumber:
          establishmentData[0].out_commercial_registration_num,
        establishmentContactNumber: establishmentData[0].out_contact_number,
        establishmentEmail: establishmentData[0].out_establishment_email,
        establishmentWebsite: establishmentData[0].out_establishment_website,
        establishmentDescription:
          establishmentData[0].out_establishment_description,
        establishmentType: establishmentData[0].out_establishment_type,
        establishmentCity: establishmentData[0].out_establishment_city,
        establishmentStreet: establishmentData[0].out_establishment_street,
        establishmentBuildingNumber:
          establishmentData[0].out_establishment_building_num,
        establishmentLogo: establishmentData[0].out_establishment_logo,
        establishmentCover: establishmentData[0].out_establishment_cover,
        establishmentComplianceIndicator:
          establishmentData[0].out_est_compliance_indicator,
        establishmentComplianceIndicatorDescription:
          establishmentData[0].out_est_compliance_indicator_desc,
      },
      progressBarUser: {
        percentage: parseInt(progressBarRetailer[0].completion_percentage),
      },
      progressBarEstablishment: {
        percentage: parseInt(
          progressBarRetailstore[0].establishment_completion_percentage
        ),
      },
      insights: retailerInsights.Insights,
    };
    // Return Data Object as Response
    return {
      success: true,
      retailerDashboard,
    };
  },
  async getRetailerNotifications(input) {
    const notifFetch = await Notification.getNotificationsByUserId(
      input.userId,
      input.pageSize,
      input.pageIndex
    );
    if (!notifFetch[0]) {
      return {
        success: false,
        error: "Unable to Fetch Notifications for Retailer",
      };
    }
    // Return Data Object as Response
    const notificationList = { notificationItem: [] };
    for (let i = 0; i < notifFetch.length; i++) {
      const item = {
        id: notifFetch[i].notification_id,
        type: notifFetch[i].notification_type,
        priority: notifFetch[i].notification_priority,
        subject: notifFetch[i].notification_subject,
        details: notifFetch[i].notification_details,
        isRead: notifFetch[i].is_read,
        creationTime: notifFetch[i].creation_date,
      };
      notificationList.notificationItem.push(item);
    }
    return {
      success: true,
      notificationList,
    };
  },
};
module.exports = dashboardService;