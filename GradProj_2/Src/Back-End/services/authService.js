// Handles password hashing, token generation, and validation
const User = require("../models/User"); // User model
const Establishment = require("../models/Establishment"); // Establishment model
const Supplier = require("../models/supplier");
const Retailer = require("../models/retailer");
const Admin = require("../models/Adminstrator");
const Factory = require("../models/Factory");
const RetailStore = require("../models/RetailStore");
const logDBModel = require("../models/Log");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const applicationModel = require("../models/Application");

const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");

const authService = {
  async registerUser(userData, establishmentData) {
    //const client = await beginTransaction();
    try {
      // Validate userType
      if (![1, 2, 3].includes(userData.userType)) {
        return {
          success: false,
          error: "Invalid User Type",
        };
      }

      // Insert user
      // Default Values for every new User
      userData.userStatus = 1;
      userData.isEmailVerified = true;
      userData.lastModifiedBy = 1;
      userData.userImage = null;
      const userResult = await User.create(userData);
      const newUserId = userResult[0].res;
      if (!userResult[0].res || userResult[0].res == -1) {
        return {
          success: false,
          error: "Unable to Create User in Database",
        };
      }
      let newAdminId, newRetailerId, newSupplierId, establishmentId;

      // Role-specific logic
      if (userData.userType === 1) {
        // Admin creation logic (if needed)
        const adminResult = await Admin.insertAdministrator(1, newUserId);
        if (!adminResult[0].out_admin_id || adminResult[0].out_admin_id == -1) {
          return {
            success: false,
            error: "Unable to Create User in Database",
          };
        }
        newAdminId = adminResult[0].out_admin_id;
      } else if (userData.userType === 2) {
        // Supplier creation logic
        if (!establishmentData) {
          return {
            success: false,
            error: "Establishment data is required for suppliers",
          };
        }
        // Insert establishment
        // Default Values for every Establishment
        establishmentData.lastModifiedBy = newUserId;
        establishmentData.establishmentStatus = 1;
        establishmentData.establishmentCover = null;
        establishmentData.establishmentType = false;
        establishmentData.estComplianceIndicator = 1;
        establishmentData.estComplianceIndicatorDesc = "GOOD";
        establishmentData.lastModifiedBy = newUserId;
        const establishmentResult =
          await Establishment.insertEstablishment(establishmentData);

        if (
          !establishmentResult[0].out_establishment_id ||
          establishmentResult[0].out_establishment_id == -1
        ) {
          return {
            success: false,
            error: "Unable to Create Establishment in Database",
          };
        }
        establishmentId = establishmentResult[0].out_establishment_id;

        const inputData = {
          supplierUserId: newUserId,
          supplierTaxIdentificationNum: null,
          supplierBankAccountNum: null,
          supplierIban: null,
          supplierComplianceIndicator: 1,
          supplierComplaintCount: 0,
          supplierPositiveReviewCount: 0,
          lastModifiedBy: newUserId,
        };
        // Insert supplier
        const supplierResult = await Supplier.insertSupplier(inputData);
        newSupplierId = supplierResult[0].out_supplier_id;
        if (
          !supplierResult[0].out_supplier_id ||
          supplierResult[0].out_supplier_id == -1
        ) {
          return {
            success: false,
            error: "Unable to Create Supplier in Database",
          };
        }
        // Insert factory
        const factoryResult = await Factory.insertOwnedFactory(
          newSupplierId,
          establishmentId
        );
      } else {
        // Retailer creation logic
        if (!establishmentData) {
          return {
            success: false,
            error: "Establishment data is required for retailers",
          };
        }

        // Insert establishment
        // Default Values for every Establishment
        establishmentData.lastModifiedBy = newUserId;
        establishmentData.establishmentStatus = 1;
        establishmentData.establishmentCover = null;
        establishmentData.establishmentType = false;
        establishmentData.estComplianceIndicator = 1;
        establishmentData.estComplianceIndicatorDesc = "GOOD";
        establishmentData.lastModifiedBy = newUserId;
        const establishmentResult =
          await Establishment.insertEstablishment(establishmentData);
        if (
          !establishmentResult[0].out_establishment_id ||
          establishmentResult[0].out_establishment_id == -1
        ) {
          return {
            success: false,
            error: "Unable to Create Establishment in Database",
          };
        }
        establishmentId = establishmentResult[0].out_establishment_id;

        // Insert retailer
        const inputData = {
          retailerUserId: newUserId,
          retailerTaxIdentificationNum: null,
          retailerBankAccountNum: null,
          retailerIban: null,
          retailerComplianceIndicator: 1,
          retailerComplaintCount: 0,
          lastModifiedBy: newUserId,
        };
        const retailerResult = await Retailer.insertRetailer(inputData);
        if (
          !retailerResult[0].out_retailer_id ||
          retailerResult[0].out_retailer_id == -1
        ) {
          return {
            success: false,
            error: "Unable to Create Retailer in Database",
          };
        }
        newRetailerId = retailerResult[0].out_retailer_id;
        // Insert factory
        const RetailStoreResult = await RetailStore.insertRetailStore(
          newSupplierId,
          establishmentId,
          newUserId
        );
      }

      //await commitTransaction(client);
      // Generate JWT Token
      const tokenDBRes = await executeQuery(
        "SELECT token_version FROM user_localized WHERE user_id = $1",
        [newUserId]
      );

      const tokenVersion = tokenDBRes[0].token_version;
      const payload = {
        userId: newUserId,
        userType: userData.userType,
        username: userData.userName,
        tokenVersion,
      };

      const token = jwt.sign(
        payload,
        keys.jwtSecret, // Use a secure key stored in .env
        { expiresIn: "1d" } // Token expiry
      );
      const response = {
        success: true,
        userId: newUserId,
        adminId: newAdminId || null,
        supplierId: newSupplierId || null,
        retailerId: newRetailerId || null,
        factoryId: newSupplierId ? establishmentId + "-" + newSupplierId : null,
        retailstoreId: newRetailerId
          ? establishmentId + "-" + newRetailerId
          : null,
        token: token,
      };
      const inputData = {
        logUserId: newUserId,
        actionDetails: "Create New User: " + newUserId,
        actionJsonPayload: `${JSON.stringify(response)}`,
        actionDescription: "DATA CREATION",
        isTransactional: true,
      };
      await logDBModel.insertLog(inputData);
      return response;
    } catch (error) {
      //await rollbackTransaction(client);
      throw error;
    }
  },
  async loginUser(userData) {
    try {
      // Validate User
      const userResult = await User.validate(userData);

      if (userResult[0].out_is_valid != 1) {
        return {
          success: false,
        };
      }

      const tokenDBRes = await executeQuery(
        "SELECT token_version FROM user_localized WHERE user_id = $1",
        [userResult[0].out_user_id]
      );

      const tokenVersion = tokenDBRes[0].token_version;
      const payload = {
        userId: userResult[0].out_user_id,
        userType: userResult[0].out_user_type,
        username: userData.userName,
        tokenVersion,
      };

      // Generate JWT Token
      const token = jwt.sign(
        payload,
        keys.jwtSecret, // Use a secure key stored in .env
        { expiresIn: "1d" } // Token expiry
      );
      return {
        success: true,
        userId: userResult[0].out_user_id,
        userType: userResult[0].out_user_type,
        token: token,
      };
    } catch (error) {
      throw error;
    }
  },
  async submitApplication(applicationData) {
    try {
      // Insert application
      // Default Values for every new User
      // userType,
      // firstName ,
      // lastName ,
      // userName ,
      // email ,
      // password  ,
      // phoneNumber ,
      // establishmentName ,
      // establishmentContactNumber ,
      // establishmentEmail ,
      // establishmentDescription ,
      // establishmentCommercialRegistrationNum ,
      // establishmentCity ,
      // establishmentStreet ,
      // establishmentBuildingNum ,
      // establishmentIndustryType,
      // establishmentLogo,

      const applicationResult =
        await applicationModel.insertApplication(applicationData);

      if (!applicationResult || applicationResult == -1) {
        return {
          success: false,
          error: "Unable to Create Application in Database",
        };
      }
      return {
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },
  async checkUsernameAvailability(username) {
    try {
      const dBRes = await executeQuery(
        "SELECT COUNT(*) AS exists FROM user_localized WHERE user_name_lclzd = $1",
        [username]
      );
      const isAvailableDB = parseInt(dBRes[0].exists) > 0 ? false : true;
      return {
        success: true,
        isAvailable: isAvailableDB,
      };
    } catch (error) {
      throw error;
    }
  },
  async checkApplicationStatus(userData) {
    try {
      const applicationResult = await applicationModel.checkApplicationStatus(
        userData.email,
        userData.username,
        userData.password
      );
      if (!applicationResult) {
        return {
          success: false,
          error: "Unable to Check Application in Database",
        };
      }
      return {
        success: true,
        applicationStatus: applicationResult,
      };
    } catch (error) {
      throw error;
    }
  },
  async getApplicationsList(pageSize, pageIndex) {
    try {
      const applicationResult = await applicationModel.getAllApplications(
        pageSize,
        pageIndex
      );
      if (!applicationResult) {
        return {
          success: false,
          error: "Unable to Get Applications from Database",
        };
      }
      const applicationListLcl = { applicationItem: [] };
      for (let i = 0; i < applicationResult.length; i++) {
        const applicationItem = {};
        applicationItem.id = applicationResult[i].out_application_id;
        applicationItem.establishmentName =
          applicationResult[i].out_establishment_name;
        applicationItem.establishmentLogo =
          applicationResult[i].out_establishment_logo;
        applicationItem.status = applicationResult[i].out_application_status;
        applicationListLcl.applicationItem.push(applicationItem);
      }
      return {
        success: true,
        applicationList: applicationListLcl,
      };
    } catch (error) {
      throw error;
    }
  },
  async getApplicationById(applicationId) {
    try {
      const applicationResult =
        await applicationModel.getApplicationById(applicationId);
      if (!applicationResult) {
        return {
          success: false,
          error: "Unable to Get Applications from Database",
        };
      }
      return {
        success: true,
        application: {
          id: applicationResult[0].out_application_id,
          userType: applicationResult[0].out_user_type,
          firstName: applicationResult[0].out_first_name,
          lastName: applicationResult[0].out_last_name,
          userEmail: applicationResult[0].out_user_email,
          userPhoneNumber: applicationResult[0].out_user_phone_number,
          establishmentName: applicationResult[0].out_establishment_name,
          establishmentDescription:
            applicationResult[0].out_establishment_description,
          establihsmentCommercialRegistrationNumber:
            applicationResult[0]
              .out_establishment_commercial_registration_number,
          establishmentContactNumber:
            applicationResult[0].out_establishment_contact_number,
          establishmentEmail: applicationResult[0].out_establishment_email,
          establishmentCity: applicationResult[0].out_establishment_city,
          estbalishmentBuildingNumber:
            applicationResult[0].out_establishment_building_number,
          establishmentIndustryTypes:
            applicationResult[0].out_establishment_industry_type_spec,
          establishmentLogo: applicationResult[0].out_establishment_logo,
        },
      };
    } catch (error) {
      throw error;
    }
  },
  async updateApplicationStatus(userData) {
    try {
      const applicationResult = await applicationModel.updateApplicationStatus(
        userData.applicationId,
        userData.status
      );
      if (!applicationResult) {
        return {
          success: false,
          error: "Unable to Update Application in Database",
        };
      }
      return {
        success: true
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = authService;
