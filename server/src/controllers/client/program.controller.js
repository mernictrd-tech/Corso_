const Program = require("../../models/program.model");

// Get active programs for public website
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({
      isActive: true,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Programs fetched successfully.",
      data: programs,
    });
  } catch (error) {
    console.error("Get programs error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch programs.",
    });
  }
};

const getProgramBySlug = async (req, res) => {
  try {
    const program = await Program.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate("category", "name");

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
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch program.",
    });
  }
};

module.exports = {
  getPrograms,
  getProgramBySlug
};
