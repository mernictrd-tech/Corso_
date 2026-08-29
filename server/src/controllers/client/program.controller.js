const Program = require("../../models/program.model");
const topicModel = require("../../models/topic.model");

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
    const { slug } = req.params;

    let program = await Program.findOne({
      slug,
      isActive: true,
    }).populate("category", "name");

    // If not found by slug, check if the value is a valid ObjectId
    if (!program && mongoose.Types.ObjectId.isValid(slug)) {
      program = await Program.findOne({
        _id: slug,
        isActive: true,
      }).populate("category", "name");
    }

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    const topics = await topicModel
      .find({
        program: program._id,
        isActive: true,
      })
      .select("name description");

    return res.status(200).json({
      success: true,
      data: {
        ...program.toObject(),
        topics,
      },
    });
  } catch (error) {
    console.error("Get program error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch program.",
    });
  }
};

module.exports = {
  getPrograms,
  getProgramBySlug,
};
