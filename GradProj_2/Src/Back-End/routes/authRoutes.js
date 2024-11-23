// Routes for authentication (/login, /signup, /logout, etc.).
const express = require("express");
const router = express.Router();
const controller = require('../controllers/authController');
const validateToken = require('../middlewares/validateToken');

router.post("/token", controller.generateToken);
router.post("/signup", controller.signUp);
router.use(validateToken);
//router.post("/login", controller.login);
module.exports = router;
