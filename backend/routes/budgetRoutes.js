const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createBudget,
  getBudgetStatus,
} = require("../controllers/budgetController");

// Create Budget
router.post("/", authMiddleware, createBudget);

// Get Budget Status
router.get("/", authMiddleware, getBudgetStatus);

module.exports = router;
