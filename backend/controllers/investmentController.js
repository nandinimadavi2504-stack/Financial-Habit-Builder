const Investment = require("../models/Investment");

// ===========================
// Add Investment
// ===========================
exports.addInvestment = async (req, res) => {
  try {
    const { investmentType, amountInvested, currentValue, investmentDate } =
      req.body;

    const investment = await Investment.create({
      user: req.user.id,
      investmentType,
      amountInvested,
      currentValue,
      investmentDate,
    });

    res.status(201).json({
      success: true,
      message: "Investment added successfully",
      investment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Get All Investments
// ===========================
exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      investments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Update Investment
// ===========================
exports.updateInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    Object.assign(investment, req.body);

    await investment.save();

    res.status(200).json({
      success: true,
      message: "Investment updated successfully",
      investment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===========================
// Delete Investment
// ===========================
exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: "Investment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Investment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
