// Conatins Auth-related Logic (Sign up, Sign in, Sign out, Submit Application, Get Application, Check Eligibility, .. etc)
const User = require("../models/User");
const Establishment = require("../models/Establishment");
const Supplier = require("../models/Supplier");
const Retailer = require("../models/retailer");
const Admin = require("../models/Adminstrator");
const Factory = require("../models/Factory");
const RetailStore = require("../models/RetailStore");
const logDBModel = require("../models/Log");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const applicationModel = require("../models/Application");
const crypto = require("crypto");
const {
  sendEmail,
  submitNotification,
} = require("../config/notificationUtils");
const env = require("../config/env");

const {
  executeQuery,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");

const authService = {
  async registerUser(userData, establishmentData) {
    await beginTransaction();
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
        await rollbackTransaction();
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
          await rollbackTransaction();
          return {
            success: false,
            error: "Unable to Create Admin in Database",
          };
        }
        newAdminId = adminResult[0].out_admin_id;
      } else if (userData.userType === 3) {
        // Supplier creation logic
        if (!establishmentData) {
          await rollbackTransaction();
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
          await rollbackTransaction();
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
          await rollbackTransaction();
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
          await rollbackTransaction();
          return {
            success: false,
            error: "Establishment data is required for retailers",
          };
        }

        // Insert establishment
        // Default Values for every Establishment
        establishmentData.establishmentStatus = 1;
        establishmentData.establishmentCover = null;
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
          await rollbackTransaction();
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
          await rollbackTransaction();
          return {
            success: false,
            error: "Unable to Create Retailer in Database",
          };
        }

        newRetailerId = retailerResult[0].out_retailer_id;
        // Insert factory
        const RetailStoreResult = await RetailStore.insertRetailStore(
          newRetailerId,
          establishmentId,
          newUserId
        );
      }
      await commitTransaction();
      await submitNotification(1,newUserId,2,'Welcome Aboard', 'Welcome to our Platform');
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
      throw error;
    }
  },
  async loginUser(userData) {
    try {
      // Validate User
      const userResult = await User.validate(userData);
      if (userResult[0].out_user_id == 0) {
        const checkData = {
          username: userData.userName,
          email: userData.userEmail,
          password: userData.userPassword,
        };
        const checkAppInternal = await this.checkApplicationStatus(checkData);
        if (checkAppInternal.applicationStatus != "NEW") {
          return {
            success: false,
            error: "No User Found",
          };
        }
        return {
          success: true,
          error: "Application for this User is still Pending Review",
        };
      }
      if (userResult[0].out_is_valid != 1) {
        return {
          success: false,
          error: "Invalid Credentials",
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
      const sendEmailNotif = await sendEmail(
        applicationData.email,
        "New Application | Localized",
        `your Application to join Localized platform has been submitted and will be reviewed promptly,
        Application ID: ${applicationResult}`,
        `<p>your Application to join Localized platform has been submitted and will be reviewed promptly,
        Application ID: ${applicationResult}</p>`
      );
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
        totalRecordsCount: applicationResult[0].out_total_records_count,
      };
    } catch (error) {
      throw error;
    }
  },
  async searchApplications(searchTerm, pageSize, pageIndex) {
    try {
      const applicationResult = await applicationModel.searchApplication(
        searchTerm,
        pageSize,
        pageIndex
      );
      if (!applicationResult) {
        return {
          success: false,
          error: "Unable to Search Applications",
        };
      }
      const applicationList = { applicationItem: [] };
      for (let i = 0; i < applicationResult.length; i++) {
        const applicationItem = {};
        applicationItem.id = applicationResult[i].out_application_id;
        applicationItem.establishmentName =
          applicationResult[i].out_establishment_name;
        applicationItem.establishmentLogo =
          applicationResult[i].out_establishment_logo;
        applicationItem.status = applicationResult[i].out_application_status;
        applicationList.applicationItem.push(applicationItem);
      }
      return {
        success: true,
        applicationList: applicationList,
        totalRecordsCount: applicationResult[0].out_total_records_count,
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
          firstName: applicationResult[0].out_user_first_name,
          lastName: applicationResult[0].out_user_last_name,
          userEmail: applicationResult[0].out_user_email,
          userPhoneNumber: applicationResult[0].out_user_phone_number,
          establishmentName: applicationResult[0].out_establishment_name,
          establishmentDescription:
            applicationResult[0].out_establishment_description,
          establihsmentCommercialRegistrationNumber:
            applicationResult[0].out_establishment_commercial_registration_num,
          establishmentContactNumber:
            applicationResult[0].out_establishment_contact_number,
          establishmentEmail: applicationResult[0].out_establishment_email,
          establishmentCity: applicationResult[0].out_establishment_city,
          establishmentStreet: applicationResult[0].out_establishment_street,
          estbalishmentBuildingNumber:
            applicationResult[0].out_establishment_building_num,
          establishmentIndustryTypes:
            applicationResult[0].out_establishment_industry_type_spec,
          establishmentLogo: applicationResult[0].out_establishment_logo,
          applicationDate: applicationResult[0].out_application_request_date,
        },
      };
    } catch (error) {
      throw error;
    }
  },
  async updateApplicationStatus(userData) {
    try {

      if(userData.status === "APPROVED") {
          const fetchApplicationDb = await applicationModel.getApplicationById(
            userData.applicationId
          );
          let inputData = {};
          if(fetchApplicationDb[0].out_user_type === 1)
          {
            inputData = {
              user: {
                userType:  fetchApplicationDb[0].out_user_type,
                firstName: fetchApplicationDb[0].out_user_first_name,
                lastName: fetchApplicationDb[0].out_user_last_name,
                userName: fetchApplicationDb[0].out_user_name,
                userEmail: fetchApplicationDb[0].out_user_email,
                userPassword: fetchApplicationDb[0].out_user_password,
                userPhoneNumber: fetchApplicationDb[0].out_user_phone_number,
              },
            };
          }
          else
          {
            inputData = {
              user: {
                userType: fetchApplicationDb[0].out_user_type,
                firstName: fetchApplicationDb[0].out_user_first_name,
                lastName: fetchApplicationDb[0].out_user_last_name,
                userName: fetchApplicationDb[0].out_user_name,
                userEmail: fetchApplicationDb[0].out_user_email,
                userPassword: fetchApplicationDb[0].out_user_password,
                userPhoneNumber: fetchApplicationDb[0].out_user_phone_number,
              },
              establishment: {
                industryType:
                  fetchApplicationDb[0].out_establishment_industry_type_spec,
                establishmentName: fetchApplicationDb[0].out_establishment_name,
                commercialRegistrationNum:
                  fetchApplicationDb[0]
                    .out_establishment_commercial_registration_num,
                contactNumber:
                  fetchApplicationDb[0].out_establishment_contact_number,
                establishmentEmail:
                  fetchApplicationDb[0].out_establishment_email,
                establishmentWebsite: null,
                establishmentDescription:
                  fetchApplicationDb[0].out_establishment_description,
                establishmentType:
                  fetchApplicationDb[0].out_user_type === "2" ? true : false,
                establishmentCity: fetchApplicationDb[0].out_establishment_city,
                establishmentStreet:
                  fetchApplicationDb[0].out_establishment_street,
                establishmentBuildingNum:
                  fetchApplicationDb[0].out_establishment_building_num,
                establishmentLogo: fetchApplicationDb[0].out_establishment_logo,
                establishmentCover: null,
              },
            };
          }

          const signupRes = await this.registerUser(
            inputData.user,
            inputData.establishment
          );

          if (signupRes.success != true) {
            return {
              success: false,
              error: "Unable to Create User in Database",
            };
          }
          await sendEmail(
            fetchApplicationDb[0].out_user_email,
            "Application Confirmation | Localized",
            `Dear Valued Applicant, your Request to join Localized has been Approved, Welcome Aboard`,
            `<p>Dear Valued Applicant, your Request to join Localized has been Approved, Welcome Aboard</p>`
          );            
      };

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
        success: true,
      };
    } catch (error) {
      throw error;
    }
  },
  async requestPasswordReset(email) {
    try {
      // Check if the user exists
      const user = await executeQuery(
        "SELECT COUNT(*) AS is_in_db, user_id FROM user_localized WHERE user_email = $1  GROUP BY USER_ID",
        [email]
      );
      if (user[0].is_in_db == "0") {
        return {
          success: false,
          error: "Email not registered",
        };
      }

      // Generate a reset token and expiry time
      const resetToken = crypto.randomBytes(32).toString("hex");
      const now = new Date();
      const localExpiry = new Date(now.getTime() + 3600000); // Add 1 hour in milliseconds

      // Save the token to the database
      await executeQuery(
        "UPDATE user_localized SET reset_password_token = $1, reset_password_expires =  localtimestamp + interval '1hour' WHERE user_email = $2",
        [resetToken, email]
      );
      // Generate a password reset URL
      const resetUrl = `${env.frontEndURL}/reset-password?token=${resetToken}`;
      // Send reset email
      // commented till needed
      await sendEmail(
        email,
        "Password Reset | Localized",
        `You requested to reset your password. Use the link below to reset it: ${resetUrl}`,
        `<p>You requested to reset your password. Use the link below to reset it:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error("Error in password reset request:", error.message);
      throw error;
    }
  },
  async resetPassword(token, newPassword) {
    try {
      // Check if the token is valid and not expired
      const user = await executeQuery(
        "SELECT count(*) AS db_res, user_id FROM user_localized WHERE reset_password_token = $1 AND reset_password_expires > NOW()  GROUP BY USER_ID",
        [token]
      );

      if (user[0].db_res == "0") {
        return {
          success: false,
          error: "Invalid or expired reset token",
        };
      }

      // Update the user's password and clear the reset token
      await executeQuery(
        "UPDATE user_localized SET user_password = $1, reset_password_token = NULL, reset_password_expires = NULL, is_pass_change = true WHERE reset_password_token = $2",
        [newPassword, token]
      );

      await submitNotification(
        4,
        user[0].user_id,
        2,
        "Password Changed",
        "Password Changed Successfully"
      );
      
      return {
        success: true,
      };
    } catch (error) {
      console.error("Error resetting password:", error.message);
      throw error;
    }
  },
};

module.exports = authService;
