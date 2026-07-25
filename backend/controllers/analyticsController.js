const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Budget = require("../models/Budget");

// ================================
// Financial Summary
// GET /api/analytics/summary
// ================================

const getFinancialSummary = async (req, res) => {
  try {
    // Get all records for the logged-in user
    const incomes = await Income.find({ user: req.user._id });
    const expenses = await Expense.find({ user: req.user._id });
    const goals = await Goal.find({ user: req.user._id });
    const budget = await Budget.findOne({ user: req.user._id });

    // Calculate total income
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

    // Calculate total expense
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    // Calculate balance
    const balance = totalIncome - totalExpense;

    // Count goals
    const completedGoals = goals.filter(
      (goal) => goal.status === "Completed",
    ).length;

    const activeGoals = goals.filter((goal) => goal.status === "Active").length;

    // Budget calculations
    const budgetAmount = budget ? budget.amount : 0;
    const remainingBudget = budgetAmount - totalExpense;

    res.status(200).json({
      success: true,
      totalIncome,
      totalExpense,
      balance,
      totalGoals: goals.length,
      completedGoals,
      activeGoals,
      budget: budgetAmount,
      remainingBudget,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching financial summary",
      error: error.message,
    });
  }
};

// ===================================
// Expense By Category
// GET /api/analytics/categories
// ===================================

const getExpenseCategories = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
    });

    const categoryTotals = {};

    expenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    res.status(200).json({
      success: true,
      categories: categoryTotals,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching category report",
      error: error.message,
    });
  }
};

// =================================
// Monthly Report
// GET /api/analytics/monthly
// =================================

const getMonthlyReport = async (req, res) => {
  try {
    const incomes = await Income.find({
      user: req.user._id,
    });

    const expenses = await Expense.find({
      user: req.user._id,
    });

    const monthlyData = {};

    // Process Income
    incomes.forEach((income) => {
      const month = new Date(income.date).toLocaleString("default", {
        month: "long",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          income: 0,
          expense: 0,
        };
      }

      monthlyData[month].income += income.amount;
    });

    // Process Expense
    expenses.forEach((expense) => {
      const month = new Date(expense.date).toLocaleString("default", {
        month: "long",
      });

      if (!monthlyData[month]) {
        monthlyData[month] = {
          income: 0,
          expense: 0,
        };
      }

      monthlyData[month].expense += expense.amount;
    });

    res.status(200).json({
      success: true,
      monthlyReport: monthlyData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching monthly report",
      error: error.message,
    });
  }
};

// =================================
// Export All Functions
// =================================

module.exports = {
  getFinancialSummary,
  getExpenseCategories,
  getMonthlyReport,
};
