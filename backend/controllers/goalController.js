const Goal = require("../models/Goal");

// ==============================
// Create Goal
// ==============================
const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      user: req.user._id,
      title: req.body.title,
      targetAmount: req.body.targetAmount,
      savedAmount: req.body.savedAmount || 0,
      deadline: req.body.deadline,
    });

    res.status(201).json({
      success: true,
      message: "Goal created successfully!",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Goals
// ==============================
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id });

    res.json({
      success: true,
      count: goals.length,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Goal By ID
// ==============================
const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Goal
// ==============================
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    goal.title = req.body.title ?? goal.title;
    goal.targetAmount = req.body.targetAmount ?? goal.targetAmount;
    goal.savedAmount = req.body.savedAmount ?? goal.savedAmount;
    goal.deadline = req.body.deadline ?? goal.deadline;

    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = "Completed";
    }

    await goal.save();

    res.json({
      success: true,
      message: "Goal updated successfully!",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Goal Savings
// ==============================
const updateSavings = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    goal.savedAmount = req.body.savedAmount;

    if (goal.savedAmount >= goal.targetAmount) {
      goal.status = "Completed";
    }

    await goal.save();

    const progress = ((goal.savedAmount / goal.targetAmount) * 100).toFixed(2);

    res.json({
      success: true,
      message: "Savings updated successfully!",
      progress: `${progress}%`,
      goal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Goal
// ==============================
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Goal not found",
      });
    }

    res.json({
      success: true,
      message: "Goal deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Export Controllers
// ==============================
module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  updateSavings,
  deleteGoal,
};
