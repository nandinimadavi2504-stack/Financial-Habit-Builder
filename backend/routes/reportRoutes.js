const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getMonthlyReport } = require("../controllers/reportController");

// Protect all report routes
router.use(authMiddleware);

// Get Financial Report
router.get("/", getMonthlyReport);

module.exports = router;
