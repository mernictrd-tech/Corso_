const { body } = require("express-validator");

/*
|--------------------------------------------------------------------------
| Register Validation
|--------------------------------------------------------------------------
*/

const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Full name must be between 3 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("termsAccepted")
  .custom((value) => {
    if (value !== true) {
      throw new Error("You must accept the Terms & Conditions");
    }
    return true;
  }),
];

/*
|--------------------------------------------------------------------------
| Login Validation
|--------------------------------------------------------------------------
*/

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  registerValidation,
  loginValidation,
};