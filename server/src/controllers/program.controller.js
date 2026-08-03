const Program = require("../models/program.model"); 

const createProgram = async (req, res) => {
  try {
    const {
      name,
      category,
      originalPrice,
      sellingPrice,
      totalQuestions,
      thumbnail,
      description,
    } = req.body;

    // Check duplicate program code
    const existingProgram = await Program.findOne({ name });

    if (existingProgram) {
      return res.status(409).json({
        success: false,
        message: "Program code already exists.",
      });
    }

    const program = await Program.create({
      name,
      category,
      originalPrice,
      sellingPrice,
      totalQuestions,
      thumbnail: req.file ? `/uploads/programs/${req.file.filename}` : "",
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Program created successfully.",
      data: program,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create program.",
      error: error.message,
    });
  }
};

module.exports = {
  createProgram,
};