const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate.middleware");
const protect = require("../middleware/auth.middleware");

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
} = require("../controllers/auth.controller");



/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  register
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  login
);



router.get("/me", protect, me);

router.post("/logout", logout);

router.post("/google", googleAuth);

module.exports = router;

