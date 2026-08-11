const Topic = require("../models/topic.model");
const mongoose = require("mongoose");

const createTopic = async (req, res) => {
  try {
    const { name, description, program, isActive } = req.body;

    // Validate topic name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic name is required.",
      });
    }

    // Validate program
    if (!program) {
      return res.status(400).json({
        success: false,
        message: "Program is required.",
      });
    }

    // Check duplicate topic inside the same program
    const existingTopic = await Topic.findOne({
      name: name.trim(),
      program,
    });

    if (existingTopic) {
      return res.status(409).json({
        success: false,
        message: "Topic already exists in this program.",
      });
    }

    const topic = await Topic.create({
      name: name.trim(),
      description: description?.trim() || "",
      program,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      message: "Topic created successfully.",
      data: topic,
    });
  } catch (error) {
    console.error("Create Topic Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create topic.",
      error: error.message,
    });
  }
};

const getTopicsByProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    if (!programId) {
      return res.status(400).json({
        success: false,
        message: "Program ID is required.",
      });
    }

    const topics = await Topic.find({
      program: programId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Topics fetched successfully.",
      data: topics,
    });
  } catch (error) {
    console.error("Get Topics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch topics.",
      error: error.message,
    });
  }
};

const getTopicById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID.",
      });
    }

    const topic = await Topic.findById(id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Topic fetched successfully.",
      data: topic,
    });
  } catch (error) {
    console.error("Get Topic Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch topic.",
      error: error.message,
    });
  }
};

const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID.",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic name is required.",
      });
    }

    const topic = await Topic.findById(id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    // Check duplicate topic within the same program
    const existingTopic = await Topic.findOne({
      _id: { $ne: id },
      program: topic.program,
      name: name.trim(),
    });

    if (existingTopic) {
      return res.status(409).json({
        success: false,
        message: "Another topic with this name already exists in this program.",
      });
    }

    topic.name = name.trim();
    topic.description = description?.trim() || "";
    topic.isActive =
      isActive !== undefined ? Boolean(isActive) : topic.isActive;

    await topic.save();

    return res.status(200).json({
      success: true,
      message: "Topic updated successfully.",
      data: topic,
    });
  } catch (error) {
    console.error("Update Topic Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update topic.",
      error: error.message,
    });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate topic ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid topic ID.",
      });
    }

    // Find topic
    const topic = await Topic.findById(id);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found.",
      });
    }

    // Delete topic
    await Topic.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Topic deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Topic Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete topic.",
      error: error.message,
    });
  }
};

module.exports = {
  createTopic,
  getTopicsByProgram,
  getTopicById,
  updateTopic,
  deleteTopic
};
