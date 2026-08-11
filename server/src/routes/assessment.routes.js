const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getAssessmentQuestions,
  submitAssessment,
} = require("../controllers/assessment.controller");

/*
|--------------------------------------------------------------------------
| Assessment Routes
|--------------------------------------------------------------------------
*/

// Get questions for selected program
router.get(
  "/:programId/questions",
  protect,
  getAssessmentQuestions
);

// Submit assessment
router.post(
  "/:programId/submit",
  protect,
  submitAssessment
);

module.exports = router;