const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const Payment = require("../models/payment.model");

const getStudents = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          role: "user",
        },
      },
      {
        $lookup: {
          from: "assessments",
          localField: "_id",
          foreignField: "student",
          as: "assessments",
        },
      },
      {
        $addFields: {
          assessmentCount: {
            $size: "$assessments",
          },
        },
      },
      {
        $project: {
          assessments: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

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

const getStudentDetails = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID.",
      });
    }

    // Get student
    const student = await User.findOne({
      _id: studentId,
      role: "user",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
      });
    }

    // Get student's payments
    const payments = await Payment.find({
      student: studentId,
    })
      .populate("program", "name")
      .populate("assessment", "score passed")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        student,
        purchases: payments,
      },
    });
  } catch (error) {
    console.error("Get student details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student details.",
    });
  }
};

const searchStudents = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const keyword = search.trim();

    if (!keyword) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const students = await User.find({
      role: "user",
      $or: [
        {
          fullName: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .select("_id fullName email phone avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("Search students error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search students",
    });
  }
};

module.exports = {
  getStudents,
  deleteStudent,
  getStudentDetails,
  searchStudents
};
