const User = require("../models/user.model");

const generateToken = require("../utils/generateToken");

const bcrypt = require("bcryptjs");

const registerUser = async (userData) => {
  const { fullName, email, password, termsAccepted } = userData;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    termsAccepted,
  });

  const token = generateToken(user._id);

  user.password = undefined;

  return {
    user,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (password !== user.password) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user._id);

  user.password = undefined;

  return {
    user,
    token,
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

// ================= CHANGE PASSWORD =================

const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found.");
  }

  // Google login users
  if (user.provider === "google") {
    throw new Error(
      "Password change is not available for Google accounts."
    );
  }

  // Check current password
  if (currentPassword !== user.password) {
    throw new Error("Current password is incorrect.");
  }

  // New password validation
  if (newPassword.length < 6) {
    throw new Error(
      "New password must be at least 6 characters long."
    );
  }

  // Prevent same password
  if (currentPassword === newPassword) {
    throw new Error(
      "New password must be different from your current password."
    );
  }

  // Update password
  user.password = newPassword;

  await user.save();

  return true;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  changeUserPassword,
};