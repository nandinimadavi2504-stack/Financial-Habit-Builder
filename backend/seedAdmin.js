const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await Admin.findOne({
      email: "admin@financialhabit.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists.");
      process.exit(0);
    }

    await Admin.create({
      name: "Administrator",
      email: "admin@financialhabit.com",
      password: "Admin@123",
    });

    console.log("Admin created successfully!");
    console.log("Email: admin@financialhabit.com");
    console.log("Password: Admin@123");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
