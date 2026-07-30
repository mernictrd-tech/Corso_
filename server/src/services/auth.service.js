const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

const registerUser = async (userData) => {
  const {
    fullName,
    email,
    password,
    termsAccepted,
  } = userData;


  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const user = await User.create({
  fullName,
  email,
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

  const passwordMatched = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatched) {
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

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};