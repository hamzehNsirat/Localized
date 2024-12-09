// Routes for authentication (/login, /signup, /logout, etc.).
const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const validateToken = require("../middlewares/validateToken");
/*
const validateRequest = require("../middlewares/validationMiddlewares");
const schemas = require("../config/schemas");
router.post("/login", validateRequest(schemas.login), controller.signIn);
*/
// General Routes
router.post("/signup", controller.signUp);
router.post("/login", controller.signIn);
router.post("/logout", validateToken, controller.signOut);
router.post("/submitapplication", controller.submitApplication);
router.post("/requestpasswordreset", controller.requestPasswordReset);
router.post("/resetpassword", controller.resetPassword);
// Internal Routes
router.post("/checkusernameavailability", controller.checkUsernameAvailability);
router.post("/checkapplicationstatus", controller.checkApplicationStatus);
router.post(
  "/checkestablishmenteligibility",
  validateToken,
  controller.checkEstablishmentEligibility
);
// Admin Routes
router.post(
  "/getapplicationslist",
  validateToken,
  controller.getApplicationsList
);
router.post(
  "/getapplicationbyid",
  validateToken,
  controller.getApplicationById
);
router.post(
  "/updateapplicationstatus",
  validateToken,
  controller.updateApplicationStatus
);
module.exports = router;
