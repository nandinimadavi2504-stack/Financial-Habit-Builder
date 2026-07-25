const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    investmentType: {
      type: String,
      required: true,
      enum: [
        "Savings",
        "FD",
        "Mutual Fund",
        "Stocks",
        "Gold",
        "Crypto",
        "PPF",
        "Others",
      ],
    },

    amountInvested: {
      type: Number,
      required: true,
    },

    currentValue: {
      type: Number,
      required: true,
    },

    investmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Investment", investmentSchema);
