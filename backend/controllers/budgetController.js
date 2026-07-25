const Budget = require("../models/Budget");
const Expense = require("../models/Expense");

// Create Budget
const createBudget = async (req, res) => {
  try {
    const { month, year, amount } = req.body;

    const existingBudget = await Budget.findOne({
      user: req.user._id,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: "Budget already exists for this month.",
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      month,
      year,
      amount,
    });

    res.status(201).json({
      success: true,
      message: "Budget created successfully!",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Budget Status
const getBudgetStatus = async (req, res) => {
  try {
    const { month, year } = req.query;

    const budget = await Budget.findOne({
      user: req.user._id,
      month,
      year,
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found.",
      });
    }

    // Convert month name to month number
    const monthIndex = new Date(`${month} 1, ${year}`).getMonth();

    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 1);

    const expenses = await Expense.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const remaining = budget.amount - totalExpense;

    const percentage = Math.min(
      ((totalExpense / budget.amount) * 100).toFixed(2),
      100,
    );

    res.status(200).json({
      success: true,
      budget: budget.amount,
      totalExpense,
      remaining,
      percentage: `${percentage}%`,
      status: remaining >= 0 ? "✅ Within Budget" : "❌ Budget Exceeded",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudgetStatus,
};
