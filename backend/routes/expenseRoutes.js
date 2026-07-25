const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// Expense Routes
// ==========================

// Add Expense
router.post("/", authMiddleware, addExpense);

// Get All Expenses
router.get("/", authMiddleware, getExpenses);

// Get Single Expense
router.get("/:id", authMiddleware, getExpenseById);

// Update Expense
router.put("/:id", authMiddleware, updateExpense);

// Delete Expense
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
