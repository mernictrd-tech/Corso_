const Program = require("../models/program.model");
const Category = require("../models/category.model");
const fs = require("fs");
const path = require("path");

const createProgram = async (req, res) => {
  try {
    const {
      name,
      category,
      originalPrice,
      sellingPrice,
      totalQuestions,
      examDuration,
      description,
      status,
    } = req.body;

    // Check duplicate program name
    const existingProgram = await Program.findOne({ name });

    if (existingProgram) {
      return res.status(409).json({
        success: false,
        message: "Program already exists.",
      });
    }

    // Get uploaded files
    const thumbnail = req.files?.thumbnail?.[0];
    const certificateDemo = req.files?.certificateDemo?.[0];

    const program = await Program.create({
      name,
      category,
      originalPrice: Number(originalPrice),
      sellingPrice: Number(sellingPrice),
      totalQuestions: Number(totalQuestions),
      examDuration: Number(examDuration),

      thumbnail: thumbnail ? `/uploads/programs/${thumbnail.filename}` : "",

      certificateDemo: certificateDemo
        ? `/uploads/programs/certifications/${certificateDemo.filename}`
        : "",

      description,

      isActive: status === "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Program created successfully.",
      data: program,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create program.",
      error: error.message,
    });
  }
};

const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch programs.",
      error: error.message,
    });
  }
};

const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      originalPrice,
      sellingPrice,
      totalQuestions,
      description,
    } = req.body;

    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    const existingProgram = await Program.findOne({
      name,
      _id: { $ne: id },
    });

    if (existingProgram) {
      return res.status(409).json({
        success: false,
        message: "Program name already exists.",
      });
    }

    program.name = name;
    program.category = category;
    program.originalPrice = originalPrice;
    program.sellingPrice = sellingPrice;
    program.totalQuestions = totalQuestions;
    program.description = description;

    if (req.file) {
      if (program.thumbnail) {
        const oldImage = path.join(__dirname, "../../", program.thumbnail);

        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }
      }
      program.thumbnail = `/uploads/programs/${req.file.filename}`;
    }

    await program.save();

    return res.status(200).json({
      success: true,
      message: "Program updated successfully.",
      data: program,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update program.",
      error: error.message,
    });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    // Delete thumbnail if it exists
    if (program.thumbnail) {
      const imagePath = path.join(__dirname, "../../", program.thumbnail);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Program.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Program deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete program.",
      error: error.message,
    });
  }
};

const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch program.",
      error: error.message,
    });
  }
};



module.exports = {
  createProgram,
  getPrograms,
  updateProgram,
  deleteProgram,
  getProgramById,
};
