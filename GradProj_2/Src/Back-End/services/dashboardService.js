// Contains Dashboard-related logic. 
const Establishment = require("../models/Establishment");
const Supplier = require("../models/Supplier");
const Notification = require("../models/Notification");
const Factory = require("../models/Factory");
const Retailer = require("../models/retailer"); 
const RetailStore = require("../models/RetailStore");
const analytics = require("./analyticsService");
const {
  submitNotification,
} = require("../config/notificationUtils");
const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");
const userService = require("../services/userService");
const analyticsService = require("./analyticsService");

const dashboardService = {
  async getRetailerAllDetails(userId, internalCaller = false) {
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

    let retailerInsights = {};
    if (internalCaller == false) {
       retailerInsights = await analytics.getRetailerAnalytics(userId);
    }    

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
      Insights: retailerInsights || "No Current Insights",
    };
    // Return Data Object as Response
    return {
      success: true,
      retailerDashboard,
    };
  },
  async updateRetailerDetails(inObj) {
    // Update Details in Retailer Table
    const retailerId = inObj.retailerId;
    const inputData = {
      retailerUserId: inObj.retailerUserId,
      retailerTaxIdentificationNum: inObj.retailerTaxIdentificationNum,
      retailerBankAccountNum: inObj.retailerBankAccountNum,
      retailerIban: inObj.retailerIban,
      retailerComplianceIndicator: inObj.retailerComplianceIndicator,
      retailerComplaintCount: inObj.retailerComplaintCount,
      lastModifiedBy: 1,
    };

    await beginTransaction(inObj);
    const updateRetDb = await Retailer.updateRetailer(retailerId, inputData);
    if (!updateRetDb[0] || updateRetDb[0].update_res === -1) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Update Retailer Details",
      };
    }
    //    console.log(moment(Date().now).format("YYYY-MM-DD HH:mm:ss"));
    await commitTransaction();
    const user = await executeQuery(
      "SELECT retailer_user_id FROM retailer WHERE retailer_id = $1",
      [inObj.retailerId]
    );
    await submitNotification(
      10,
      user[0].retailer_user_id,
      2,
      "Profile Update",
      "Your profile has been updated successfully"
    );
    return {
      success: true,
    };
  },
  async updateRetailstoreDetails(inObj) {
    // Update Details in Establishment Table
    const retailerId = inObj.retailerId;
    const fetchEstId = await RetailStore.getOwnedRetailStores(retailerId);
    const inputData = {
      establishmentStatus: inObj.establishmentStatus,
      industryType: inObj.industryType,
      establishmentName: inObj.establishmentName,
      commercialRegistrationNum: inObj.commercialRegistrationNum,
      establishmentRegistrationDate: inObj.establishmentRegistrationDate,
      contactNumber: inObj.contactNumber,
      establishmentEmail: inObj.establishmentEmail,
      establishmentWebsite: inObj.establishmentWebsite,
      establishmentDescription: inObj.establishmentDescription,
      establishmentCity: inObj.establishmentCity,
      establishmentStreet: inObj.establishmentStreet,
      establishmentBuildingNum: inObj.establishmentBuildingNum,
      establishmentLogo: inObj.establishmentLogo,
      establishmentCover: inObj.establishmentCover,
      estComplianceIndicator: inObj.estComplianceIndicator,
      estComplianceIndicatorDesc: inObj.estComplianceIndicatorDesc,
      lastModifiedBy: 1,
    };

    await beginTransaction(inObj);
    const updateRetStoreDb = await Establishment.updateEstablishment(
      fetchEstId[0].retailstore_est_id,
      inputData
    );
    if (
      !updateRetStoreDb[0] ||
      updateRetStoreDb[0].establishment_update === -1
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Update RetailStore Details",
      };
    }
    await commitTransaction();

    const user = await executeQuery(
      "SELECT retailer_user_id FROM retailer WHERE retailer_id = $1",
      [inObj.retailerId]
    );
    await submitNotification(
      10,
      user[0].retailer_user_id,
      2,
      "Profile Update",
      "Your Retailstore profile has been updated successfully"
    );
    return {
      success: true,
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
  async getSupplierAllDetails(userId, internalCaller = false) {
    const input = {
      userId: userId,
    };
    // Fetch Data from each table
    const basicData = await userService.getUserById(input);
    const supplierData = await Supplier.getSupplierByUser(userId);
    const factoryData = await Factory.getOwnedFactories(
      supplierData[0].out_supplier_id
    );
    const establishmentData = await Establishment.getEstablishmentById(
      factoryData[0].factory_est_id
    );

    const progressBarSupplier =
      await Supplier.calculateCompletionPercentageSupplier(userId);
    const progressBarFactory =
      await Supplier.calculateSupplierEstablishmentCompletionPercentage(
        supplierData[0].out_supplier_id
      );

    let supplierInsights = {};
    if (internalCaller == false) {
      supplierInsights =
      await analyticsService.getSupplierAnalytics(userId);
    }    

    // Consilidate Data and Format it
    const supplierDashboard = {
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
      supplierDetails: {
        supplierId: supplierData[0].out_supplier_id,
        supplierTaxIdentificationNumber:
          supplierData[0].out_supplier_tax_identification_num,
        supplierBankAccountNumber:
          supplierData[0].out_supplier_bank_account_num,
        supplierIBAN: supplierData[0].out_supplier_iban,
        supplierComplianceIndicator:
          supplierData[0].out_supplier_compliance_indicator,
        supplierComplaintCount: supplierData[0].out_supplier_complaint_count,
      },
      factoryDetails: {
        factoryId:
          factoryData[0].factory_est_id + "-" + supplierData[0].out_supplier_id,
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
        percentage: progressBarSupplier,
      },
      progressBarEstablishment: {
        percentage: progressBarFactory,
      },
      insights: supplierInsights || "No Current Insights",
    };
    // Return Data Object as Response
    return {
      success: true,
      supplierDashboard,
    };
  },
  async getSupplierNotifications(input) {
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
  async updateSupplierDetails(inObj) {
    // Update Details in Retailer Table
    const supplierId = inObj.supplierId;
    const inputData = {
      supplierUserId: inObj.supplierUserId,
      supplierTaxIdentificationNum: inObj.supplierTaxIdentificationNum,
      supplierBankAccountNum: inObj.supplierBankAccountNum,
      supplierIban: inObj.supplierIban,
      supplierComplianceIndicator: inObj.supplierComplianceIndicator,
      supplierComplaintCount: inObj.supplierComplaintCount,
      lastModifiedBy: 1,
    };

    await beginTransaction(inObj);
    const updateRetDb = await Supplier.updateSupplier(supplierId, inputData);
    if (!updateRetDb[0] || updateRetDb[0].update_res === -1) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Update Supplier Details",
      };
    }
    await commitTransaction();
    const user = await executeQuery(
      "SELECT supplier_user_id FROM supplier WHERE supplier_id = $1",
      [inObj.supplierId]
    );
    await submitNotification(
      10,
      user[0].supplier_user_id,
      2,
      "Profile Update",
      "Your profile has been updated successfully"
    );
    return {
      success: true,
    };
  },
  async updateFactoryDetails(inObj) {
    // Update Details in Establishment Table
    const supplierId = inObj.supplierId;
    const fetchEstId = await Factory.getOwnedFactories(supplierId);
    const inputData = {
      establishmentStatus: inObj.establishmentStatus,
      industryType: inObj.industryType,
      establishmentName: inObj.establishmentName,
      commercialRegistrationNum: inObj.commercialRegistrationNum,
      establishmentRegistrationDate: inObj.establishmentRegistrationDate,
      contactNumber: inObj.contactNumber,
      establishmentEmail: inObj.establishmentEmail,
      establishmentWebsite: inObj.establishmentWebsite,
      establishmentDescription: inObj.establishmentDescription,
      establishmentCity: inObj.establishmentCity,
      establishmentStreet: inObj.establishmentStreet,
      establishmentBuildingNum: inObj.establishmentBuildingNum,
      establishmentLogo: inObj.establishmentLogo,
      establishmentCover: inObj.establishmentCover,
      estComplianceIndicator: inObj.estComplianceIndicator,
      estComplianceIndicatorDesc: inObj.estComplianceIndicatorDesc,
      lastModifiedBy: supplierId,
    };

    await beginTransaction(inObj);
    const updateRetStoreDb = await Establishment.updateEstablishment(
      fetchEstId[0].factory_est_id,
      inputData
    );
    if (
      !updateRetStoreDb[0] ||
      updateRetStoreDb[0].establishment_update === -1
    ) {
      await rollbackTransaction();
      return {
        success: false,
        error: "Failed to Update RetailStore Details",
      };
    }
    await commitTransaction();

    const user = await executeQuery(
      "SELECT supplier_user_id FROM supplier WHERE supplier_id = $1",
      [inObj.supplierId]
    );
    await submitNotification(
      10,
      user[0].supplier_user_id,
      2,
      "Profile Update",
      "Your Factory profile has been updated successfully"
    );
    return {
      success: true,
    };
  },
  async getAdminAllDetails(userId, internalCaller = false) {
    const input = {
      userId: userId,
    };
    // Fetch Data from each table
    const basicData = await userService.getUserById(input);
    const adminId = await executeQuery("SELECT admin_id FROM adminstrator WHERE fk_userid = $1;",[userId]);
    let adminInsights = {};
    if (internalCaller == false) {
      adminInsights = await analyticsService.getAdminstratorAnalytics(userId);
    }

    // Consilidate Data and Format it
    const adminDashboard = {
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
      adminDetails: {
       adminId: adminId[0].admin_id,
        adminTaxIdentificationNumber: null,
      },
      insights: adminInsights || "No Current Insights",
    };
    // Return Data Object as Response
    return {
      success: true,
      adminDashboard,
    };
  },
};
module.exports = dashboardService;
