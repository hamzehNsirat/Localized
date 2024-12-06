const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

// Set the directory for image uploads
const UPLOAD_DIR = path.join(
  __dirname,
  "../../../Src/Back-End/usables/uploads/images"
);

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Set the destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);

    // Use the description field for naming
    const description = req.body.description || "default";
    cb(null, `${description}-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Multer instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// API route for image upload
router.post(
  "/upload",
  upload.single("image"), // Handle the "image" field
  (req, res) => {
    try {
      const file = req.file;
      const description = req.body.description; // Explicitly handle non-file fields
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided",
        });
      }

      // Return the absolute file path
      const absolutePath = `${req.protocol}://${req.get("host")}/uploads/images/${file.filename}`;

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        imageUrl: absolutePath,
        description: description || "No description provided",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({
        success: false,
        message: "Error uploading image",
      });
    }
  }
);

module.exports = router;
