const Habit = require("../models/Habit");

// ===============================
// Create Habit
// ===============================
const createHabit = async (req, res) => {
  try {
    const { title, frequency, reminderEnabled, reminderTime } = req.body;

    const habit = await Habit.create({
      user: req.user._id,
      title,
      frequency,
      reminderEnabled,
      reminderTime,
    });

    return res.status(201).json({
      success: true,
      message: "Habit created successfully.",
      habit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get All Habits
// ===============================
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      habits,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Mark Habit Complete
// ===============================
const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    if (!habit.completed) {
      habit.completed = true;
      habit.streak += 1;
      habit.completedDates.push(new Date());
    }

    await habit.save();

    return res.status(200).json({
      success: true,
      message: "Habit completed successfully.",
      habit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Reset Habit
// ===============================
const resetHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    habit.completed = false;

    await habit.save();

    return res.status(200).json({
      success: true,
      message: "Habit reset successfully.",
      habit,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Delete Habit
// ===============================
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    await habit.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Habit deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  completeHabit,
  resetHabit,
  deleteHabit,
};
