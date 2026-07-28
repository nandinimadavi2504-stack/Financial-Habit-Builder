const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    frequency: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: true,
      default: "Daily",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    streak: {
      type: Number,
      default: 0,
      min: 0,
    },

    completedDates: [
      {
        type: Date,
      },
    ],

    reminderEnabled: {
      type: Boolean,
      default: false,
    },

    reminderTime: {
      type: String,
      default: "",
    },

    lastReminderSent: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Total number of completions
habitSchema.virtual("totalCompleted").get(function () {
  return this.completedDates.length;
});

habitSchema.set("toJSON", { virtuals: true });
habitSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Habit", habitSchema);
