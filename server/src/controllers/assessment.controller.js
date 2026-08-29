const mongoose = require("mongoose");

const Assessment = require("../models/assessment.model");
const Question = require("../models/question.model");
const Program = require("../models/program.model");
const Certificate = require("../models/certificate.model");
const AssessmentSession = require("../models/assessmentSession.model");

const PASSING_PERCENTAGE = 70;

const startAssessment = async (req, res) => {
  try {
    const { programId } = req.params;

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    const durationInMinutes = Number(program.examDuration) || 10;

    const sessionId = crypto.randomUUID();

    const startedAt = new Date();

    const expiresAt = new Date(
      startedAt.getTime() + durationInMinutes * 60 * 1000,
    );

    const session = await AssessmentSession.create({
      sessionId,
      program: program._id,
      startedAt,
      expiresAt,
      answers: {},
    });

    return res.status(201).json({
      success: true,
      message: "Assessment started",
      data: {
        sessionId: session.sessionId,
        programId: session.program,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Start assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to start assessment",
    });
  }
};

const saveAssessmentAnswers = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    const session = await AssessmentSession.findOne({
      sessionId,
      completed: false,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Assessment session not found",
      });
    }

    /*
     * Server-side timer validation
     */
    if (new Date() > session.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Assessment time has expired",
      });
    }

    session.answers = answers;

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Answers saved",
    });
  } catch (error) {
    console.error("Save assessment answers error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save answers",
    });
  }
};

const getAssessmentSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await AssessmentSession.findOne({
      sessionId,
      completed: false,
    }).populate("program");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Assessment session not found",
      });
    }

    const now = new Date();

    if (now > session.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Assessment time has expired",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        program: session.program,
        answers: session.answers,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error("Get assessment session error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get assessment session",
    });
  }
};

const completeAssessment = async (req, res) => {
  try {
    const { sessionId } = req.body;

    /*
     * Validate user information
     */

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    /*
     * Find assessment session
     */

    const session = await AssessmentSession.findOne({
      sessionId,
      completed: false,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Assessment session not found or already completed",
      });
    }

    /*
     * Check server-side expiry
     */

    if (new Date() > session.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Assessment time has expired",
      });
    }

    /*
     * Get questions
     */

    const questions = await Question.find({
      program: session.program,
    });

    /*
     * Calculate result
     */

    const answers = session.answers || {};

    let score = 0;

    questions.forEach((question) => {
      const questionId = String(question._id);

      const selectedAnswer = answers[questionId];

      if (
        selectedAnswer !== undefined &&
        Number(selectedAnswer) === Number(question.correctAnswer)
      ) {
        score++;
      }
    });

    const totalQuestions = questions.length;

    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    /*
     * Change this according to your
     * actual passing percentage.
     */

    const passed = percentage >= 50;

    /*
     * Create final Assessment
     */

    const assessment = await Assessment.create({
      program: session.program,
      score,
      totalQuestions,
      percentage,
      passed,
      answers,
      completedAt: new Date(),
    });

    /*
     * Mark temporary session completed
     */

    session.completed = true;
    session.completedAt = new Date();

    await session.save();

    /*
     * Return result
     */

    return res.status(201).json({
      success: true,
      message: "Assessment completed successfully",

      data: {
        assessmentId: assessment._id,
        score,
        totalQuestions,
        percentage,
        passed,
      },
    });
  } catch (error) {
    console.error("Complete assessment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete assessment",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Assessment Questions
|--------------------------------------------------------------------------
*/

const getAssessmentQuestions = async (req, res) => {
  try {
    const { programId } = req.params;
    const studentId = req.user?._id;

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

    // Check if the student has already completed and purchased a certificate for this program
    if (studentId) {
      const existingCertificate = await Certificate.findOne({
        user: studentId,
        program: programId,
        status: "Issued",
      }).populate("program");

      if (existingCertificate) {
        return res.status(200).json({
          success: true,
          alreadyCertified: true,
          program: {
            id: program._id,
            name: program.name,
            totalQuestions: 0,
            examDuration: program.examDuration || 10,
          },
          data: {
            passed: true,
            score: existingCertificate.score || 100,
            totalMarks: 100,
            totalQuestions: 1,
            percentage: existingCertificate.score || 100,
            certificate: existingCertificate,
          },
        });
      }
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

    // Verify all questions have been answered
    const unansweredQuestions = questions.filter(
      (question) =>
        answers[question._id.toString()] === undefined ||
        answers[question._id.toString()] === "" ||
        answers[question._id.toString()] === null,
    );

    if (unansweredQuestions.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`,
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
  startAssessment,
  saveAssessmentAnswers,
  getAssessmentSession,
  completeAssessment
};
