// Routes for authentication (/login, /signup, /logout, etc.).
const express = require("express");
const router = express.Router();
const controller = require('../controllers/authController');
const validateToken = require('../middlewares/validateToken');
 
router.post("/signup", controller.signUp);
router.post("/login", controller.signIn);
router.use(validateToken);
module.exports = router;
