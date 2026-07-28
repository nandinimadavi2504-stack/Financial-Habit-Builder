const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  completeHabit,
  resetHabit,
  deleteHabit,
} = require("../controllers/habitController");

// Protect all routes
router.use(authMiddleware);

// ======================================
// Collection Routes
// ======================================
router.route("/").get(getHabits).post(createHabit);

// ======================================
// Single Habit Routes
// ======================================
router.route("/:id").get(getHabitById).put(updateHabit).delete(deleteHabit);

// ======================================
// Habit Actions
// ======================================
router.patch("/:id/complete", completeHabit);

router.patch("/:id/reset", resetHabit);

module.exports = router;
