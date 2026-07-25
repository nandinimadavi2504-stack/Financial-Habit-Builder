const express = require("express");
const router = express.Router();

const {
  getFinancialSummary,
  getExpenseCategories,
  getMonthlyReport,
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");

// Financial Summary
router.get("/summary", authMiddleware, getFinancialSummary);

// Expense Category Report
router.get("/categories", authMiddleware, getExpenseCategories);

// Monthly Report
router.get("/monthly", authMiddleware, getMonthlyReport);

module.exports = router;
