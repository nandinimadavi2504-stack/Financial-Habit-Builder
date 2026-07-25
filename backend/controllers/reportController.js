const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Goal = require("../models/Goal");
const Investment = require("../models/Investment");
const Habit = require("../models/Habit");

const getMonthlyReport = async (req, res) => {
  try {
    const userId = req.user._id;

    const incomes = await Income.find({ user: userId });
    const expenses = await Expense.find({ user: userId });
    const goals = await Goal.find({ user: userId });
    const investments = await Investment.find({ user: userId });
    const habits = await Habit.find({ user: userId });

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

    const totalSavings = totalIncome - totalExpense;

    const savingsRate =
      totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(2) : 0;

    const totalInvestment = investments.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    const completedHabits = habits.filter((habit) => habit.completed).length;

    res.json({
      success: true,
      report: {
        totalIncome,
        totalExpense,
        totalSavings,
        savingsRate,
        totalGoals: goals.length,
        totalInvestment,
        totalHabits: habits.length,
        completedHabits,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMonthlyReport,
};
