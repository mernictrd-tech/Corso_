const Program = require("../../models/program.model");

const getProgramSuggestion = async (req, res) => {
  try {
    const programs = await Program.find().populate("category", "name").sort({ createdAt: -1 });

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

module.exports = {
    getProgramSuggestion
}