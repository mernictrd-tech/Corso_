const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  getAssessmentQuestions,
  submitAssessment,
  startAssessment,
  saveAssessmentAnswers,
  getAssessmentSession,
  completeAssessment,
} = require("../controllers/assessment.controller");

/*
|--------------------------------------------------------------------------
| Assessment Routes
|--------------------------------------------------------------------------
*/

// Get questions for selected program
router.get("/:programId/questions/:sessionId", getAssessmentQuestions);

// Submit assessment
// router.post("/:programId/submit", submitAssessment);

router.post("/:programId/start", startAssessment);

router.put("/session/:sessionId/answers", saveAssessmentAnswers);

router.get("/session/:sessionId", getAssessmentSession);

router.post("/complete", completeAssessment);

module.exports = router;
