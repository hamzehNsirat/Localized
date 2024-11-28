// Routes for user profile and account management
const express = require("express");
const router = express.Router();
const controller = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken');

// General User Operations
router.post("/get", validateToken, controller.getSingleUser);
router.post("/update", validateToken, controller.updateSingleUser);
router.post("/delete", validateToken, controller.deleteUser);
// Admin Oriented
router.post("/getall", validateToken, controller.getUserList);
router.post("/reviewuser", validateToken, controller.reviewUser);

module.exports = router;