const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  addInvestment,
  getInvestments,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
} = require("../controllers/investmentController");

// Protect all investment routes
router.use(authMiddleware);

// Collection Routes
router.route("/").get(getInvestments).post(addInvestment);

// Single Investment Routes
router
  .route("/:id")
  .get(getInvestmentById)
  .put(updateInvestment)
  .delete(deleteInvestment);

module.exports = router;
