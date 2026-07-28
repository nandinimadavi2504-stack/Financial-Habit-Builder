const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assetType: {
      type: String,
      required: true,
      enum: [
        "Cash",
        "Bank Account",
        "Property",
        "Vehicle",
        "Gold",
        "Silver",
        "Jewellery",
        "Electronics",
        "Land",
        "Others",
      ],
    },

    assetName: {
      type: String,
      required: true,
      trim: true,
    },

    currentValue: {
      type: Number,
      required: true,
      min: 0,
    },

    purchaseValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    purchaseDate: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

assetSchema.virtual("profitLoss").get(function () {
  return this.currentValue - this.purchaseValue;
});

assetSchema.set("toJSON", { virtuals: true });
assetSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Asset", assetSchema);
