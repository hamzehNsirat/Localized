// Routes for authentication (/login, /signup, /logout, etc.).
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/User"); // Replace with your actual user model path
const keys = require("../config/keys");            // Load essential configurations
const router = express.Router();



router.post("/token", async(req, res) =>{
  const { createToken } = req.body;
  try {
    // Generate JWT Token
    const token = jwt.sign(
      // {
      //   userId: user[0].user_id, // Replace with actual user field
      //   role: user[0].role, // Include roles if needed

      // },
      keys.jwtSecret, // Use a secure key stored in .env
      { expiresIn: "1h" } // Token expiry
    );
    res.json({ token, message: "Token generated successfully" });

  }
  catch {
    res.status(500).json({ message: "Internal server error" });
  }
})

module.exports = router;