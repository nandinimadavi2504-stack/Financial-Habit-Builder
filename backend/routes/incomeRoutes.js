const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const incomeController = require("../controllers/incomeController");

console.log("authMiddleware:", authMiddleware);
console.log("typeof authMiddleware:", typeof authMiddleware);

router.post("/", authMiddleware, incomeController.addIncome);
router.get("/", authMiddleware, incomeController.getIncome);
router.get("/:id", authMiddleware, incomeController.getIncomeById);
router.put("/:id", authMiddleware, incomeController.updateIncome);
router.delete("/:id", authMiddleware, incomeController.deleteIncome);

module.exports = router;
