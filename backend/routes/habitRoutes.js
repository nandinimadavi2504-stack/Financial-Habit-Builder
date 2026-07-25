const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createHabit,
  getHabits,
  completeHabit,
  resetHabit,
  deleteHabit,
} = require("../controllers/habitController");

// Create Habit
router.post("/", authMiddleware, createHabit);

// Get All Habits
router.get("/", authMiddleware, getHabits);

// Mark Habit as Completed
router.put("/complete/:id", authMiddleware, completeHabit);

// Reset Habit
router.put("/reset/:id", authMiddleware, resetHabit);

// Delete Habit
router.delete("/:id", authMiddleware, deleteHabit);

module.exports = router;
