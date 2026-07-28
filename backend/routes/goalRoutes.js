const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  updateSavings,
  deleteGoal,
} = require("../controllers/goalController");

// Protect all goal routes
router.use(authMiddleware);

// Goal Collection
router.route("/").get(getGoals).post(createGoal);

// Goal Details
router.route("/:id").get(getGoalById).put(updateGoal).delete(deleteGoal);

// Update Goal Savings
router.patch("/:id/savings", updateSavings);

module.exports = router;
