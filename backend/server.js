const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");

// ===========================
// Load Environment Variables
// ===========================
dotenv.config();

// ===========================
// Connect Database
// ===========================
connectDB();

const app = express();

// ===========================
// Middleware
// ===========================
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// ===========================
// Import Routes
// ===========================
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const goalRoutes = require("./routes/goalRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const habitRoutes = require("./routes/habitRoutes");
const profileRoutes = require("./routes/profileRoutes");
const investmentRoutes = require("./routes/investmentRoutes");

// Admin Routes
const adminRoutes = require("./routes/adminRoutes");

// Feedback Routes
const feedbackRoutes = require("./routes/feedbackRoutes");

// Monthly Report Routes (NEW)
const reportRoutes = require("./routes/reportRoutes");

// ===========================
// API Routes
// ===========================

// Authentication
app.use("/api/auth", authRoutes);

// Income
app.use("/api/income", incomeRoutes);

// Expense
app.use("/api/expense", expenseRoutes);

// Dashboard
app.use("/api/dashboard", dashboardRoutes);

// Savings Goal
app.use("/api/goal", goalRoutes);

// Budget
app.use("/api/budget", budgetRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);

// Habit Tracker
app.use("/api/habits", habitRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Wealth Growth / Investments
app.use("/api/investments", investmentRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Feedback
app.use("/api/feedback", feedbackRoutes);

// Monthly Financial Report (NEW)
app.use("/api/report", reportRoutes);

// ===========================
// Home Route
// ===========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Financial Habit Builder Backend Running Successfully 🚀",
  });
});

// ===========================
// 404 Route
// ===========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ===========================
// Start Server
// ===========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
