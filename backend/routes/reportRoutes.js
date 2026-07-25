const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getMonthlyReport } = require("../controllers/reportController");

router.get("/", authMiddleware, getMonthlyReport);

module.exports = router;
