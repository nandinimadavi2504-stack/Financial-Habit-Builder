const express = require("express");
const router = express.Router();

const {
  addInvestment,
  getInvestments,
  updateInvestment,
  deleteInvestment,
} = require("../controllers/investmentController");

const authMiddleware = require("../middleware/authMiddleware");

// Add Investment
router.post("/", authMiddleware, addInvestment);

// Get All Investments
router.get("/", authMiddleware, getInvestments);

// Update Investment
router.put("/:id", authMiddleware, updateInvestment);

// Delete Investment
router.delete("/:id", authMiddleware, deleteInvestment);

module.exports = router;
