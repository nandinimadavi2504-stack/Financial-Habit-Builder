const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function resetPassword() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    const email = "aaryaneha74@gmail.com";
    const newPassword = "Pass@123";

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found.");
      process.exit(0);
    }

    user.password = hashedPassword;
    await user.save();

    console.log("✅ Password reset successfully!");
    console.log("Email:", email);
    console.log("New Password:", newPassword);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
    process.exit(1);
  }
}

resetPassword();
