const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");

// Get Profile
router.get("/", authMiddleware, getProfile);

// Create / Update Profile
router.put("/", authMiddleware, updateProfile);

module.exports = router;
