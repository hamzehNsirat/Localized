// User endpoints
const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");
/*
const validateRequest = require("../middlewares/validationMiddlewares");
const schemas = require("../config/schemas");
router.post("/login", validateRequest(schemas.login), controller.signIn);
*/
// General User Routes
router.post("/get", validateToken, controller.getSingleUser);
router.post("/update", validateToken, controller.updateSingleUser);
router.post("/delete", validateToken, controller.deleteUser);
// Admin Routes
router.post("/search", validateToken, controller.searchUser);
router.post("/getall", validateToken, controller.getUserList);
router.post("/reviewuser", validateToken, controller.reviewUser);
router.post("/getalldata", validateToken, controller.getUserAllData);
router.post("/updatestatus", validateToken, controller.updateUserStatus);
router.post("/add", validateToken, controller.addUser);

module.exports = router;
