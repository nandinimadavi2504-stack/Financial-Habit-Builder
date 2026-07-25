const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("Starting MongoDB connection...");

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected Successfully");
    console.log("Database Host:", conn.connection.host);
    console.log("Database Name:", conn.connection.name);
    console.log(
      "Users Collection:",
      mongoose.connection.collections.users?.collectionName,
    );

    return conn;
  } catch (error) {
    console.error("MongoDB Connection Failed");
    console.error(error);
    throw error;
  }
};

module.exports = connectDB;
