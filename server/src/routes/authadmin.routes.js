const express = require("express");
const router = express.Router();

const validate = require("../middleware/validate.middleware");
const protect = require("../middleware/auth.middleware");

const {
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

router.post("program/store", );

module.exports = router;