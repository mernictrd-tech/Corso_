import { body } from "express-validator";

export const createContactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters.")
    .matches(/^[A-Za-z\s.'-]+$/)
    .withMessage("Name can only contain letters and spaces."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters.")
    .normalizeEmail(),

  body("phone")
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit Indian mobile number."),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Subject must be between 3 and 100 characters."),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required.")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters."),
];