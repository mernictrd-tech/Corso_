const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate.middleware");
const protect = require("../middleware/auth.middleware");

const uploadProfile = require("../middleware/uploadprofile.middleware");

const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");

const {
  register,
  login,
  me,
  logout,
  googleAuth,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const {
  getProgramSuggestion,
  updateProfile,
} = require("../controllers/users/dashboard.controller");

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Register
router.post("/register", registerValidation, validate, register);

// Login
router.post("/login", loginValidation, validate, login);

// Current User
router.get("/me", protect, me);

// Change Password
router.put("/change-password", protect, changePassword);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// Logout
router.post("/logout", logout);

// Google Login
router.post("/google", googleAuth);

////////////////////  Program Suggestion  ////////////////////

router.get("/programs/suggestion", protect, getProgramSuggestion);

router.put(
  "/profile",
  protect,
  uploadProfile.single("profileImage"),
  updateProfile,
);

module.exports = router;
