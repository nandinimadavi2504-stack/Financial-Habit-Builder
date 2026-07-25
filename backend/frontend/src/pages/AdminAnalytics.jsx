import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import AdminSidebar from "../components/AdminSidebar";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function AdminAnalytics() {
  const data = {
    labels: ["Income", "Expenses", "Goals", "Investments", "Habits", "Users"],
    datasets: [
      {
        label: "System Statistics",
        data: [120000, 75000, 35, 15, 50, 20],
        backgroundColor: [
          "#2563eb",
          "#dc2626",
          "#16a34a",
          "#7c3aed",
          "#f59e0b",
          "#0891b2",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <>
      <AdminSidebar />

      <div className="admin-dashboard">
        <h1>Analytics</h1>

        <Bar data={data} options={options} />
      </div>
    </>
  );
}

export default AdminAnalytics;
