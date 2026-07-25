const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  getProfile,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// ===============================
// Authentication Routes
// ===============================
router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/forgot-password", forgotPassword);

router.get("/profile", protect, getProfile);

module.exports = router;
