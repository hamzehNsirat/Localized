
// Handles password hashing, token generation, and validation
const User = require("../models/User"); // User model
const Establishment = require("../models/Establishment"); // Establishment model
const Supplier = require("../models/supplier");
const Retailer = require("../models/retailer");
const Admin = require("../models/Adminstrator");
const bcrypt = require("bcrypt");
const {
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
} = require("../config/database");

const authService = {
  async registerUser(userData, establishmentData) {
    //const client = await beginTransaction();
    try {
        console.log("Im A");
       // Validate userType
      if (![1, 2, 3].includes(userData.userType)) {
        throw new Error("Invalid user type.");
      }
        console.log("Im B");

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.userPassword, 1);
      userData.password = hashedPassword;

      // Insert user
      const userResult = await User.create(userData);
      const newUserId = userResult[0].res;
      let newAdminId, newRetailerId, newSupplierId, establishmentId;
         console.log("Im C" + newUserId);

      // Role-specific logic
      if (userData.userType === 1) {
        // Admin creation logic (if needed)
        const adminResult = await Admin.insertAdministrator(1,newUserId);
        console.log(adminResult[0].res);
        console.log(adminResult[0]);
        newAdminId = adminResult[0].res;
      } else if (userData.userType === 2) {
        // Supplier creation logic
        if (!establishmentData) {
          throw new Error("Establishment data is required for suppliers.");
        }

        // Insert establishment
        establishmentData.lastModifiedBy = newUserId;
        const establishmentResult =
          await Establishment.insertEstablishment(establishmentData);
        establishmentId = establishmentResult[0].res;
        const inputData = {
          supplierUserId: newUserId,
          supplierTaxIdentificationNum: userData.TIN,
          supplierBankAccountNum: userData.bankAccountNumber,
          supplierIban: userData.IBAN,
          supplierComplianceIndicator: 1,
          supplierComplaintCount: 0,
          supplierPositiveReviewCount: 0,
          lastModifiedBy: newUserId,
        };
        // Insert supplier
        const supplierResult = await Supplier.insertSupplier(inputData);
        newSupplierId = supplierResult[0].res;
      } else if (userData.userType === 3) {
        // Retailer creation logic
        if (!establishmentData) {
          throw new Error("Establishment data is required for retailers.");
        }

        // Insert establishment
        establishmentData.lastModifiedBy = newUserId;
        const establishmentResult =
          await Establishment.insertEstablishment(establishmentData);
        establishmentId = establishmentResult[0].res;

        // Insert retailer
        const inputData = {
          retailerUserId: newUserId,
          retailerTaxIdentificationNum: userData.TIN,
          retailerBankAccountNum: userData.bankAccountNumber,
          retailerIban: userData.IBAN,
          retailerComplianceIndicator: 1,
          retailerComplaintCount: 0,
          lastModifiedBy: newUserId,
        };
        const retailerResult = Retailer.insertRetailer(inputData);
        newRetailerId = retailerResult[0].res;
      }
              console.log("Im D");

      //await commitTransaction(client);
      return {
        success: true,
        userId: newUserId,
        adminId: newAdminId || null,
        supplierId: newSupplierId || null,
        retailerId: newRetailerId || null,
        factoryId: establishmentId + newSupplierId || null,
        retailstoreId: establishmentId + newRetailerId || null,
      };
    } catch (error) {
     // await rollbackTransaction(client);
      throw error;
    }
  },
};

module.exports = authService;
