const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
      trim: true,
    },

    investmentName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    amountInvested: {
      type: Number,
      required: true,
      min: 0,
    },

    currentValue: {
      type: Number,
      required: true,
      min: 0,
    },

    investmentDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Profit / Loss
investmentSchema.virtual("profitLoss").get(function () {
  return this.currentValue - this.amountInvested;
});

// ROI (%)
investmentSchema.virtual("roi").get(function () {
  if (this.amountInvested === 0) return 0;

  return (
    ((this.currentValue - this.amountInvested) / this.amountInvested) *
    100
  ).toFixed(2);
});

module.exports = mongoose.model("Investment", investmentSchema);
