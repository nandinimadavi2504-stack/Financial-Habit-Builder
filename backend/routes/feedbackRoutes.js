const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// User
router.post("/", authMiddleware, createFeedback);

// Admin
router.get("/", authMiddleware, adminMiddleware, getAllFeedback);

router.delete("/:id", authMiddleware, adminMiddleware, deleteFeedback);

module.exports = router;
