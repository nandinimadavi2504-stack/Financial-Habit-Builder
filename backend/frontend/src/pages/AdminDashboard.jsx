import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminService";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIncome: 0,
    totalExpense: 0,
    totalGoals: 0,
    totalHabits: 0,
    totalInvestments: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load Admin Dashboard");
    }
  };

  return (
    <>
      <AdminSidebar />

      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>

        <h3>Welcome, {user?.fullName}</h3>

        <p>
          <strong>Role:</strong> {user?.role}
        </p>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Total Users</h2>
            <h3>{stats.totalUsers}</h3>
          </div>

          <div className="dashboard-card">
            <h2>Total Income</h2>
            <h3>₹{stats.totalIncome}</h3>
          </div>

          <div className="dashboard-card">
            <h2>Total Expenses</h2>
            <h3>₹{stats.totalExpense}</h3>
          </div>

          <div className="dashboard-card">
            <h2>Total Goals</h2>
            <h3>{stats.totalGoals}</h3>
          </div>

          <div className="dashboard-card">
            <h2>Total Investments</h2>
            <h3>₹{stats.totalInvestments}</h3>
          </div>

          <div className="dashboard-card">
            <h2>Total Habits</h2>
            <h3>{stats.totalHabits}</h3>
          </div>
        </div>

        <button className="refresh-btn" onClick={loadDashboard}>
          Refresh Dashboard
        </button>
      </div>
    </>
  );
}

export default AdminDashboard;
