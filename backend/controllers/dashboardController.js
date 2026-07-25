const Income = require("../models/Income");
const Expense = require("../models/Expense");

const getDashboard = async (req, res) => {
  try {
    const incomes = await Income.find({ user: req.user._id });
    const expenses = await Expense.find({ user: req.user._id });

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      success: true,
      dashboard: {
        totalIncome,
        totalExpense,
        balance,
        totalIncomeRecords: incomes.length,
        totalExpenseRecords: expenses.length,
      },
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
  getDashboard,
};
