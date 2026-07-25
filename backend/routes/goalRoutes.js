const express = require("express");
const router = express.Router();

const {
  createGoal,
  getGoals,
  updateSavings,
  deleteGoal,
} = require("../controllers/goalController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Goal
router.post("/", authMiddleware, createGoal);

// Get All Goals
router.get("/", authMiddleware, getGoals);

// Update Saved Amount
router.put("/:id", authMiddleware, updateSavings);

// Delete Goal
router.delete("/:id", authMiddleware, deleteGoal);

module.exports = router;
