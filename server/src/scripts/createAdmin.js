require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const mongoose = require("mongoose");
const Admin = require("../models/admin.model");

const createAdmin = async () => {
  try {
    // Check MongoDB URI
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const email = "mernictrd1@gmail.com";

    // Check existing admin
    const exists = await Admin.findOne({ email });

    if (exists) {
      console.log("Admin already exists.");
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create admin
    const admin = await Admin.create({
      name: "Super Admin",
      email,
      password: "admin@1234",
      role: "admin",
      isActive: true,
    });

    console.log("Admin Created Successfully");
    console.log("Admin ID:", admin._id);
    console.log("Email:", admin.email);

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error("Create Admin Error:", error);

    await mongoose.connection.close();

    process.exit(1);
  }
};

createAdmin();