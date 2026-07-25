import { useEffect, useState } from "react";
import {
  getFinancialSummary,
  getExpenseCategories,
  getMonthlyReport,
} from "../services/analyticsService";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar, Line } from "react-chartjs-2";

import "../styles/Analytics.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function Analytics() {
  const [summary, setSummary] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const summaryRes = await getFinancialSummary();
      const categoryRes = await getExpenseCategories();
      const monthlyRes = await getMonthlyReport();

      setSummary(summaryRes);
      setCategoryData(categoryRes.categories);
      setMonthlyData(monthlyRes.monthlyReport);
    } catch (error) {
      console.log(error);
    }
  };

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
      },
    ],
  };

  const months = Object.keys(monthlyData);

  const income = months.map((m) => monthlyData[m].income);

  const expense = months.map((m) => monthlyData[m].expense);

  const barData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: income,
      },
      {
        label: "Expense",
        data: expense,
      },
    ],
  };

  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: income,
      },
      {
        label: "Expense",
        data: expense,
      },
    ],
  };

  return (
    <div className="analytics-page">
      <h1>📊 Financial Analytics Dashboard</h1>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Income</h3>
          <h2>₹{summary.totalIncome || 0}</h2>
        </div>

        <div className="summary-card">
          <h3>Total Expense</h3>
          <h2>₹{summary.totalExpense || 0}</h2>
        </div>

        <div className="summary-card">
          <h3>Balance</h3>
          <h2>₹{summary.balance || 0}</h2>
        </div>

        <div className="summary-card">
          <h3>Remaining Budget</h3>
          <h2>₹{summary.remainingBudget || 0}</h2>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-card">
          <h2>Expense Categories</h2>
          <Pie data={pieData} />
        </div>

        <div className="chart-card">
          <h2>Monthly Income & Expense</h2>
          <Bar data={barData} />
        </div>

        <div className="chart-card full-width">
          <h2>Income vs Expense Trend</h2>
          <Line data={lineData} />
        </div>
      </div>

      <div className="insights">
        <h2> Financial Insights</h2>

        <ul>
          <li>Total Goals: {summary.totalGoals || 0}</li>
          <li>Completed Goals: {summary.completedGoals || 0}</li>
          <li>Active Goals: {summary.activeGoals || 0}</li>

          {summary.balance > 0 ? (
            <li> You are saving money.</li>
          ) : (
            <li> Your expenses exceed your income.</li>
          )}

          {summary.remainingBudget >= 0 ? (
            <li> You are within your budget.</li>
          ) : (
            <li> Budget exceeded.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
