// Routes for authentication (/login, /signup, /logout, etc.).
const express = require("express");
const router = express.Router();
const controller = require('../controllers/authController');
const validateToken = require('../middlewares/validateToken');
 
router.post("/signup", controller.signUp);
router.post("/login", controller.signIn);
router.post("/logout", validateToken, controller.signOut);
router.post("/submitapplication", controller.submitApplication);
router.post("/checkusernameavailability", controller.checkUsernameAvailability);
router.post("/checkapplicationstatus", controller.checkApplicationStatus);
router.post("/getapplicationslist", validateToken, controller.getApplicationsList);
router.post("/getapplicationbyid", validateToken, controller.getApplicationById);
router.post("/updateapplicationstatus", validateToken, controller.updateApplicationStatus);
router.use(validateToken);
module.exports = router;
