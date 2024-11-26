// Routes for user profile and account management
const express = require("express");
const router = express.Router();
const controller = require('../controllers/userController');
const validateToken = require('../middlewares/validateToken');

// General User Operations
router.get("/get", validateToken, controller.getSingleUser);
//router.post("/update", validateToken, controller.updateSingleUser);
// Admin Oriented
//router.post('/getall', validateToken, controller.getAll);
//router.post("/reviewuser", validateToken, controller.reviewUser);
//router.post("/deleteuser", validateToken, controller.deleteUser);

module.exports = router;