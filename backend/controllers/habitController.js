const mongoose = require("mongoose");
const Habit = require("../models/Habit");

// ======================================
// Create Habit
// ======================================
const createHabit = async (req, res) => {
  try {
    const { title, frequency, reminderEnabled, reminderTime } = req.body;

    if (!title || !frequency) {
      return res.status(400).json({
        success: false,
        message: "Title and frequency are required.",
      });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title,
      frequency,
      reminderEnabled,
      reminderTime,
    });

    res.status(201).json({
      success: true,
      message: "Habit created successfully.",
      habit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get All Habits
// ======================================
const getHabits = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", frequency } = req.query;

    const query = {
      user: req.user._id,
    };

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (frequency) {
      query.frequency = frequency;
    }

    const total = await Habit.countDocuments(query);

    const habits = await Habit.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      habits,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Get Habit By ID
// ======================================
const getHabitById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Habit ID.",
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    res.status(200).json({
      success: true,
      habit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Update Habit
// ======================================
const updateHabit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Habit ID.",
      });
    }

    const habit = await Habit.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit updated successfully.",
      habit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Complete Habit
// ======================================
const completeHabit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Habit ID.",
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    const today = new Date().toDateString();

    const alreadyCompleted = habit.completedDates.some(
      (date) => new Date(date).toDateString() === today,
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: "Habit already completed today.",
      });
    }

    habit.completed = true;
    habit.streak += 1;
    habit.completedDates.push(new Date());
    habit.lastReminderSent = null;

    await habit.save();

    res.status(200).json({
      success: true,
      message: "Habit marked as completed.",
      habit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Reset Habit
// ======================================
const resetHabit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Habit ID.",
      });
    }

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    habit.completed = false;

    await habit.save();

    res.status(200).json({
      success: true,
      message: "Habit reset successfully.",
      habit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ======================================
// Delete Habit
// ======================================
const deleteHabit = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Habit ID.",
      });
    }

    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        success: false,
        message: "Habit not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Habit deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  completeHabit,
  resetHabit,
  deleteHabit,
};
