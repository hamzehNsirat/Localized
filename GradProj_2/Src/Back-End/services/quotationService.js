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
const quotationService = {
  async requestQuotation(userData) {
    // Fetch Data from each table
    // Return Data Object as Response
    return {
      success: true,
      userData,
    };
  },
};
module.exports = quotationService;
