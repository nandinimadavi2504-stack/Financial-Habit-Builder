const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Investment = require("../models/Investment");
const Asset = require("../models/Asset");
const Habit = require("../models/Habit");

// ======================================
// Get Monthly Financial Report
// ======================================
const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id;

    const [incomes, expenses, goals, investments, assets, habits] =
      await Promise.all([
        Income.find({ user: userId }),
        Expense.find({ user: userId }),
        Goal.find({ user: userId }),
        Investment.find({ user: userId }),
        Asset.find({ user: userId }),
        Habit.find({ user: userId }),
      ]);

    // ======================================
    // Total Income
    // ======================================

    const totalIncome = incomes.reduce(
      (sum, income) => sum + Number(income.amount || 0),
      0,
    );

    // ======================================
    // Total Expense
    // ======================================

    const totalExpense = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0,
    );

    // ======================================
    // Savings
    // ======================================

    const totalSavings = totalIncome - totalExpense;

    const savingsRate =
      totalIncome > 0
        ? Number(((totalSavings / totalIncome) * 100).toFixed(2))
        : 0;

    // ======================================
    // Investments
    // ======================================

    const totalInvestment = investments.reduce(
      (sum, investment) =>
        sum + Number(investment.currentValue || investment.amountInvested || 0),
      0,
    );

    // ======================================
    // Assets
    // ======================================

    const totalAssets = assets.reduce(
      (sum, asset) => sum + Number(asset.currentValue || 0),
      0,
    );

    // ======================================
    // Goals
    // ======================================

    const totalGoals = goals.length;

    const completedGoals = goals.filter(
      (goal) => Number(goal.savedAmount || 0) >= Number(goal.targetAmount || 0),
    ).length;

    // ======================================
    // Habits
    // ======================================

    const totalHabits = habits.length;

    const completedHabits = habits.filter(
      (habit) => habit.completed === true,
    ).length;

    const longestHabitStreak =
      habits.length > 0
        ? Math.max(...habits.map((habit) => Number(habit.streak || 0)))
        : 0;

    // ======================================
    // Net Worth
    // ======================================

    const netWorth = totalSavings + totalInvestment + totalAssets;

    // ======================================
    // Financial Health Score
    // ======================================

    let financialHealthScore = 0;

    if (savingsRate >= 30) {
      financialHealthScore = 100;
    } else if (savingsRate >= 20) {
      financialHealthScore = 80;
    } else if (savingsRate >= 10) {
      financialHealthScore = 60;
    } else if (savingsRate > 0) {
      financialHealthScore = 40;
    }

    res.status(200).json({
      success: true,
      report: {
        totalIncome,
        totalExpense,
        totalSavings,
        savingsRate,

        totalGoals,
        completedGoals,

        totalInvestment,

        totalAssets,

        totalHabits,
        completedHabits,
        longestHabitStreak,

        netWorth,

        financialHealthScore,
      },
    });
  } catch (error) {
    console.error("Monthly Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getMonthlyReport,
};
