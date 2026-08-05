const Question = require("../models/question.model");

const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, category, program, marks } =
      req.body;

    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
      category,
      program,
      marks,
    });

    return res.status(201).json({
      success: true,
      message: "Question created successfully.",
      data: newQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create question.",
      error: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    await Question.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete question.",
      error: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      question,
      options,
      correctAnswer,
      category,
      program,
      marks,
      isActive,
    } = req.body;

    const existingQuestion = await Question.findById(id);

    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    existingQuestion.question = question;
    existingQuestion.options = options;
    existingQuestion.correctAnswer = correctAnswer;
    if (category !== undefined) existingQuestion.category = category;
    if (marks !== undefined) existingQuestion.marks = marks;
    existingQuestion.program = program;
    existingQuestion.isActive = isActive;

    await existingQuestion.save();

    return res.status(200).json({
      success: true,
      message: "Question updated successfully.",
      data: existingQuestion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update question.",
      error: error.message,
    });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate("program", "name")
      .populate("category", "name");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch question.",
      error: error.message,
    });
  }
};

const getQuestionsByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const questions = await Question.find({
      program: programId,
    })
      .populate("program", "name")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions.",
      error: error.message,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
  getQuestionsByProgram,
};
