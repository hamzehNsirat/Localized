const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const UPLOAD_DIR = path.join(
  __dirname,
  "../../../Src/Back-End/usables/uploads/images"
);
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const description = req.body.description || "default";
    cb(null, `${description}-${uniqueSuffix}${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// API route for image upload
router.post(
  "/upload",
  upload.single("image"),                       // Handle the "image" field
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
router.get("/fetch/:filename", (req, res) => {
  try {
    const filename = req.params.filename;                                 // Get the filename from the URL
    const filePath = path.join(__dirname, "../uploads/images", filename); // Construct full path
    // Check if the file exists and send it
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ error: "Image not found" });
      }
    });
  } catch (error) {
    console.error("Error fetching image:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
