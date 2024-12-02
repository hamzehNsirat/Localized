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
    userId:userId
   }
   console.log(input);
   // Fetch Data from each table
   const basicData = await userService.getUserById(input);
   const retailerData = await Retailer.getRetailerByUserId(userId);

  //  const retailStoreData = await RetailStore.getOwnedRetailStores(retailerData[0].out_retailer_id);
  //  const establishmentData = await Establishment.getEstablishmentById(retailStoreData[0].retailstore_est_id);
  //  const progressBarRetailer = await Retailer.calculateCompletionPercentage(userId);
  //  const progressBarRetailstore = await Retailer.calculateEstablishmentCompletionPercentage(retailerData[0].out_retailer_id); 
  //  const retailerInsights = {Insights: 'To Be Done'};
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
     },
     retailerDetails: { 
      retailerId: retailerData },
     retailStoreDetails: {},
     establishmentDetails: {},
     progressBarUser: {},
     progressBarEstablishment: {},
     insights: {},
   };
    // Return Data Object as Response
    return {
    success: true,
    retailerDashboard
   }
  }
};
module.exports = dashboardService;