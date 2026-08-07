const User = require("../models/user.model");

const getStudents = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
      error: error.message,
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.findById(id);

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete student.",
      error: error.message,
    });
  }
};

module.exports = {
  getStudents,
  deleteStudent
};
