const Income = require("../models/Income");

// =============================
// Add Income
// =============================
const addIncome = async (req, res) => {
  try {
    const { title, amount, source, note, date } = req.body;

    if (!title || !amount || !source) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const income = await Income.create({
      user: req.user._id,
      title,
      amount,
      source,
      note,
      date,
    });

    res.status(201).json({
      success: true,
      message: "Income added successfully!",
      income,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Get All Income
// =============================
const getIncome = async (req, res) => {
  try {
    const income = await Income.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: income.length,
      income,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Get Single Income
// =============================
const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found.",
      });
    }

    res.status(200).json({
      success: true,
      income,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Update Income
// =============================
const updateIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found.",
      });
    }

    income.title = req.body.title || income.title;
    income.amount = req.body.amount || income.amount;
    income.source = req.body.source || income.source;
    income.note = req.body.note || income.note;
    income.date = req.body.date || income.date;

    await income.save();

    res.status(200).json({
      success: true,
      message: "Income updated successfully!",
      income,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =============================
// Delete Income
// =============================
const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        message: "Income not found.",
      });
    }

    await income.deleteOne();

    res.status(200).json({
      success: true,
      message: "Income deleted successfully!",
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
  addIncome,
  getIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
};
