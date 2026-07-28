import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllIncome } from "../services/incomeService";
import { getAllExpenses } from "../services/expenseService";
import { getGoals } from "../services/goalService";
import { getHabits } from "../services/habitService";
import { getInvestments } from "../services/investmentService";

import DashboardCards from "../components/DashboardCards";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import ExpensePieChart from "../components/ExpensePieChart";
import InvestmentChart from "../components/InvestmentChart";
import RecentTransactions from "../components/RecentTransactions";
import GoalProgress from "../components/GoalProgressBar";
import HabitProgress from "../components/HabitProgress";

import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [investments, setInvestments] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const incomeData = await getAllIncome();
      const expenseData = await getAllExpenses();
      const goalData = await getGoals();
      const habitData = await getHabits();
      const investmentData = await getInvestments();

      const incomeList = incomeData.income || [];
      const expenseList = expenseData.expenses || [];
      const goalList = goalData.goals || [];
      const habitList = habitData.habits || [];
      const investmentList = investmentData.investments || [];

      setIncome(incomeList);
      setExpenses(expenseList);
      setGoals(goalList);
      setHabits(habitList);
      setInvestments(investmentList);

      const incomeTotal = incomeList.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );

      const expenseTotal = expenseList.reduce(
        (sum, item) => sum + Number(item.amount),
        0,
      );

      const investmentTotal = investmentList.reduce(
        (sum, item) =>
          sum + Number(item.currentValue || item.amountInvested || 0),
        0,
      );

      setTotalIncome(incomeTotal);
      setTotalExpense(expenseTotal);
      setTotalInvestment(investmentTotal);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <h2 className="loading">Loading Dashboard...</h2>;
  }

  const currentBalance = totalIncome - totalExpense;

  const financialHealth =
    totalIncome === 0 ? 0 : Math.round((currentBalance / totalIncome) * 100);
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Financial Habit Builder & Wealth Growth Tracker</h1>

          <h2>Welcome back, {user?.fullName || "User"} 👋</h2>

          <p className="dashboard-subtitle">
            Track your finances, build healthy habits and grow your wealth.
          </p>

          <p className="dashboard-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Dashboard Cards */}
      <DashboardCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        currentBalance={currentBalance}
        totalInvestments={totalInvestment}
      />

      {/* Financial Health */}
      <div className="health-card">
        <h2>Financial Health Score</h2>

        <h1>{financialHealth}%</h1>

        <p>
          {financialHealth >= 80
            ? "Excellent"
            : financialHealth >= 60
              ? "Good"
              : financialHealth >= 40
                ? "Average"
                : "Needs Improvement"}
        </p>
      </div>

      {/* Charts */}
      <div className="chart-section">
        <IncomeExpenseChart income={totalIncome} expense={totalExpense} />
      </div>

      <div className="chart-grid">
        <ExpensePieChart expenses={expenses} />

        <InvestmentChart investments={investments} />
      </div>

      {/* Progress */}
      <div className="progress-grid">
        <GoalProgress goals={goals} />

        <HabitProgress habits={habits} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions incomes={income} expenses={expenses} />

      {/* Quick Actions */}
      <div className="actions">
        <button className="action-btn" onClick={() => navigate("/income")}>
          Add Income
        </button>

        <button className="action-btn" onClick={() => navigate("/expense")}>
          Add Expense
        </button>

        <button className="action-btn" onClick={() => navigate("/goal")}>
          Savings Goal
        </button>

        <button className="action-btn" onClick={() => navigate("/budget")}>
          Budget
        </button>

        <button className="action-btn" onClick={() => navigate("/analytics")}>
          Analytics
        </button>

        <button className="action-btn" onClick={() => navigate("/habit")}>
          Habit Tracker
        </button>

        <button className="action-btn" onClick={() => navigate("/investment")}>
          Wealth Growth
        </button>

        <button className="action-btn" onClick={() => navigate("/profile")}>
          Profile
        </button>

        <button className="action-btn" onClick={() => navigate("/report")}>
          Monthly Report
        </button>

        <button className="action-btn" onClick={() => navigate("/feedback")}>
          Feedback
        </button>
      </div>

      {/* Financial Summary */}
      <div className="transactions">
        <h2>Financial Summary</h2>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Total Income</td>
              <td>₹{totalIncome.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Total Expense</td>
              <td>₹{totalExpense.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Current Balance</td>
              <td>₹{currentBalance.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Total Investments</td>
              <td>₹{totalInvestment.toLocaleString()}</td>
            </tr>

            <tr>
              <td>Financial Health</td>
              <td>{financialHealth}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
