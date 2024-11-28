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
      userData.isEmailVerified = false;
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
        establishmentData.establishmentEmail = null;
        establishmentData.establishmentLogo = null;
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
        establishmentData.establishmentEmail = null;
        establishmentData.establishmentType = true;
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

      const inputData = {
        logUserId: newUserId,
        actionDetails: "Create New User" + newUserId,
        actionJsonPayload: null,
        actionDescription: "DATA CREATION",
        isTransactional: true,
      };
      await logDBModel.insertLog(inputData);
      return {
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
};

module.exports = authService;
