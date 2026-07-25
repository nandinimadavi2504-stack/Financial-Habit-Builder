const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getDashboardStats,
  getUsers,
  deleteUser,
} = require("../controllers/adminController");

const protectAdmin = require("../middleware/adminMiddleware");

// Public Route
router.post("/login", adminLogin);

// Protected Routes
router.get("/dashboard", protectAdmin, getDashboardStats);
router.get("/users", protectAdmin, getUsers);
router.delete("/users/:id", protectAdmin, deleteUser);

module.exports = router;
