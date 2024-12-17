// Conatins User Related Logic (Get/GetList/Update/Delete)
const userModel = require("../models/User");
const logDBModel = require("../models/Log");
const usrReviewModel = require("../models/UserReview");
const Notification = require("../models/Notification");
const Supplier = require("../models/Supplier");
const Retailer = require("../models/retailer"); 
const Establishment = require("../models/Establishment");
const RetailStore = require("../models/RetailStore");
const Factory = require("../models/Factory");
const authService = require("./authService");

const userService = {
  async getUserById(userData) {
    // Fetch user details by user ID
    const dbFetch = await userModel.get(userData);
    if (!dbFetch[0]) {
      return {
        success: false,
      };
    }

    return {
      success: true,
      nationalNumber: dbFetch[0].national_number,
      userType: dbFetch[0].user_type,
      userStatus: dbFetch[0].user_status,
      firstName: dbFetch[0].first_name,
      middleName: dbFetch[0].middle_name,
      lastName: dbFetch[0].last_name,
      fullName:
        dbFetch[0].first_name +
        " " +
        (dbFetch[0].middle_name || "") +
        " " +
        dbFetch[0].last_name,
      dateOfBirth: dbFetch[0].date_of_birth,
      userEmail: dbFetch[0].user_email,
      userPhone: dbFetch[0].user_phone_number,
      userName: dbFetch[0].user_name,
      userAddress: dbFetch[0].user_address,
      userImage: dbFetch[0].user_image,
    };
  },
  async getUserAllData(userId, userType) {
    const input = {
      userId: userId,
    };
    let result = {};
    if (userType === "1") {
      const basicData = await this.getUserById(input);
      // Consilidate Data and Format it
      result = {
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
          adminTaxIdentificationNumber: null,
        },
      };
    } else if (userType === "2") {
      // Fetch Data from each table
      const basicData = await this.getUserById(input);
      const retailerData = await Retailer.getRetailerByUserId(userId);
      const retailStoreData = await RetailStore.getOwnedRetailStores(
        retailerData[0].out_retailer_id
      );
      const establishmentData = await Establishment.getEstablishmentById(
        retailStoreData[0].retailstore_est_id
      );
      result = {
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
      };
    } else if (userType === "3") {
      // Fetch Data from each table
      const basicData = await this.getUserById(input);
      const supplierData = await Supplier.getSupplierByUser(userId);
      const factoryData = await Factory.getOwnedFactories(
        supplierData[0].out_supplier_id
      );
      const establishmentData = await Establishment.getEstablishmentById(
        factoryData[0].factory_est_id
      );
      result = {
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
            factoryData[0].factory_est_id +
            "-" +
            supplierData[0].out_supplier_id,
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
      };
    }

    return {
      success: true,
      userData: result,
    };
  },

  async updateUser(userData) {
    // Update user details
    if (userData.userPassword != null) {
      userData.isPassChange = true;
    } else {
      userData.isPassChange = false;
    }
    userData.lastModifiedBy = userData.userId;
    const dbUpdate = await userModel.update(userData);
    if (dbUpdate[0].update_res != 0) {
      return {
        success: false,
      };
    }
    const inputData = {
      logUserId: userData.userId,
      actionDetails: "Update User Data for User Id: " + userData.userId,
      actionJsonPayload: null,
      actionDescription: "DATA UPDATE",
      isTransactional: true,
    };
    await logDBModel.insertLog(inputData);
    notificationData = {
      notificationType: 10,
      notifiedUserId: userData.userId,
      notificationPriority: 1,
      notificationSubject: "Profile Updated",
      notificationDetails: `your profile has been updated!`,
      lastModifiedBy: 1,
    };
    await Notification.insertNotification(notificationData);

    return {
      success: true,
    };
  },
  async getUserList(pageSize, pageIndex) {
    const inputData = {
      pageSize: pageSize,
      pageIndex: pageIndex,
    };
    const dbFetchList = await userModel.getList(inputData);
    if (!dbFetchList[0]) {
      return {
        success: false,
        error: "Unable to Fetch Users from Database",
      };
    }
    const userList = { user: [] };

    for (let i = 0; i < dbFetchList.length; i++) {
      const item = dbFetchList[i]; // Fetch the current item once
      const userObject = {}; // Create a new object for each user

      userObject.userId = item.user_id;
      userObject.nationalNumber = item.national_number;
      userObject.userType = item.user_type;
      userObject.userStatus = item.user_status;
      userObject.firstName = item.first_name;
      userObject.middleName = item.middle_name;
      userObject.lastName = item.last_name;
      userObject.username = item.user_name;
      userObject.email = item.user_email;
      userObject.phone = item.user_phone_number;
      userObject.dateOfBirth = item.date_of_birth;
      userObject.userAddress = item.user_address;
      userObject.isEmailVerified = item.is_email_verified;
      userObject.userImage = item.user_image;

      // Add the userObject to the user array
      userList.user.push(userObject);
    }
    return {
      success: true,
      userList: userList,
    };
  },
  async searchUsers(searchTerm, pageSize, pageIndex) {
    const dbFetchList = await userModel.search(searchTerm, pageSize, pageIndex);
    if (!dbFetchList[0]) {
      return {
        success: false,
        error: "Unable to Fetch Results from Database",
      };
    }
    const userList = { user: [] };

    for (let i = 0; i < dbFetchList.length; i++) {
      const item = dbFetchList[i]; // Fetch the current item once
      const userObject = {}; // Create a new object for each user

      userObject.userId = item.user_id;
      userObject.nationalNumber = item.national_number;
      userObject.userType = item.user_type;
      userObject.userStatus = item.user_status;
      userObject.firstName = item.first_name;
      userObject.middleName = item.middle_name;
      userObject.lastName = item.last_name;
      userObject.username = item.user_name;
      userObject.email = item.user_email;
      userObject.phone = item.user_phone_number;
      userObject.dateOfBirth = item.date_of_birth;
      userObject.userAddress = item.user_address;
      userObject.isEmailVerified = item.is_email_verified;
      userObject.userImage = item.user_image;

      // Add the userObject to the user array
      userList.user.push(userObject);
    }
    return {
      success: true,
      userList: userList,
    };
  },

  async reviewUser(userData) {
    // Update user details
    const dbUpdate = await userModel.updateStatus(userData);
    if (dbUpdate[0].update_res != 0) {
      return {
        success: false,
      };
    }
    const inputData = {
      logUserId: userData.userId,
      actionDetails: "Update User Data for User Id: " + userData.userId,
      actionJsonPayload: null,
      actionDescription: "DATA UPDATE",
      isTransactional: true,
    };
    await logDBModel.insertLog(inputData);
    const inputData2 = {
      adminId: userData.lastModifiedBy,
      userId: userData.userId,
      decisionTaken: "ADMITTANCE",
      decisionReason: "",
      creationDate: new Date(),
      lastModifiedBy: 1,
    };
    await usrReviewModel.insert(inputData2);
    return {
      success: true,
    };
  },
  async deleteUser(userId) {
    // Update user details
    userData = { userId: userId };
    const dbDelete = await userModel.delete(userData);
    if (dbDelete[0].update_res != 0) {
      return {
        success: false,
      };
    }
    const inputData = {
      logUserId: userData.userId,
      actionDetails: "Delete User Data for User Id: " + userData.userId,
      actionJsonPayload: null,
      actionDescription: "DATA UPDATE",
      isTransactional: true,
    };
    await logDBModel.insertLog(inputData);

    return {
      success: true,
    };
  },
  async updateUserStatus(userId, userStatus) {
    // Update user status
    const userData = {
      userStatus: userStatus,
      userId: userId,
      lastModifiedBy: 1,
    };
    const dbUpdate = await userModel.updateStatus(userData);
    if (dbUpdate[0].update_res != 0) {
      return {
        success: false,
        error: "Failed to Update Status",
      };
    }
    const inputData = {
      logUserId: userData.userId,
      actionDetails: "Update User Status for User Id: " + userData.userId,
      actionJsonPayload: null,
      actionDescription: "DATA UPDATE",
      isTransactional: true,
    };
    await logDBModel.insertLog(inputData);

    return {
      success: true,
    };
  },
  async addUser(input) {
    // Update user status
      const user = {
        userType: input.userType,
        firstName: input.firstName,
        lastName: input.lastName,
        userName: input.userName,
        userEmail: input.userEmail,
        userPassword: input.userPassword,
        userPhoneNumber: input.userPhoneNumber,
      };
      const establishment = {
        industryType: input.industryType,
        establishmentName: input.establishmentName,
        commercialRegistrationNum: input.commercialRegistrationNum,
        contactNumber: input.contactNumber,
        establishmentEmail: input.establishmentEmail,
        establishmentWebsite: null,
        establishmentDescription: input.establishmentDescription,
        establishmentType: input.establishmentType,
        establishmentCity: input.establishmentCity,
        establishmentStreet: input.establishmentStreet,
        establishmentBuildingNum: input.establishmentBuildingNum,
        establishmentLogo: input.establishmentLogo,
        establishmentCover: null,
      };

    const signUp = await authService.registerUser(user, establishment);
    console.log(signUp);
    if (signUp.success != true) {
      return {
        success: false,
        error: "Unable to Create User",
      };
    }
    return {
      success: true,
    };
  },
};
module.exports = userService;
