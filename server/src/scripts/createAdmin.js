require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const exists = await User.findOne({
      email: "priti.ictrd@gmail.com",
    });

    if (exists) {
      console.log("Admin already exists.");
      process.exit();
    }

   await User.create({
  fullName: "Super Admin",
  email: "priti.ictrd@gmail.com",
  password: "admin@123",
  role: "admin",
  provider: "local",
  termsAccepted: true,
  isVerified: true,
});

    console.log("Admin Created Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit();
  }
};

createAdmin();