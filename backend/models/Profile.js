const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    occupation: {
      type: String,
      default: "",
    },

    monthlyIncome: {
      type: Number,
      default: 0,
    },

    savingTarget: {
      type: Number,
      default: 0,
    },

    investmentType: {
      type: String,
      default: "Savings",
    },

    address: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profile", profileSchema);
