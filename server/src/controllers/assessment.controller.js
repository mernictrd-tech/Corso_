const mongoose = require("mongoose");

const Assessment = require("../models/assessment.model");
const Question = require("../models/question.model");
const Program = require("../models/program.model");

const PASSING_PERCENTAGE = 70;

/*
|--------------------------------------------------------------------------
| Get Assessment Questions
|--------------------------------------------------------------------------
*/

const getAssessmentQuestions = async (req, res) => {
  try {
    const { programId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID.",
      });
    }

    const program = await Program.findOne({
      _id: programId,
      isActive: true,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    const questions = await Question.find({
      program: programId,
      isActive: true,
    })
      .select("_id question options marks")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      program: {
        id: program._id,
        name: program.name,
        totalQuestions: questions.length,
        examDuration: program.examDuration || 10,
      },
      data: questions,
    });
  } catch (error) {
    console.error("Get assessment questions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load assessment.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Submit Assessment
|--------------------------------------------------------------------------
*/

const submitAssessment = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { programId } = req.params;
    const { answers } = req.body;

    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID.",
      });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required.",
      });
    }

    const program = await Program.findOne({
      _id: programId,
      isActive: true,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    const questions = await Question.find({
      program: programId,
      isActive: true,
    }).select("_id correctAnswer marks");

    if (!questions.length) {
      return res.status(400).json({
        success: false,
        message: "No questions found for this program.",
      });
    }

    let score = 0;
    let totalMarks = 0;

    questions.forEach((question) => {
      const marks = Number(question.marks || 1);

      totalMarks += marks;

      const submittedAnswer = answers[question._id.toString()];

      if (
        submittedAnswer !== undefined &&
        Number(submittedAnswer) === Number(question.correctAnswer)
      ) {
        score += marks;
      }
    });

    const percentage =
      totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    const passed = percentage >= PASSING_PERCENTAGE;

    const assessment = await Assessment.create({
      student: studentId,
      program: programId,
      score,
      totalQuestions: questions.length,
      percentage,
      passed,
      answers,
    });

    return res.status(200).json({
      success: true,
      message: passed
        ? "Congratulations! You passed the assessment."
        : "Assessment completed. You did not reach the passing score.",
      data: {
        assessmentId: assessment._id,
        score,
        totalMarks,
        totalQuestions: questions.length,
        percentage,
        passed,
        passingPercentage: PASSING_PERCENTAGE,
      },
    });
  } catch (error) {
    console.error("Submit assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit assessment.",
      error: error.message,
    });
  }
};

module.exports = {
  getAssessmentQuestions,
  submitAssessment,
};