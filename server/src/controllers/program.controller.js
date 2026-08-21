const Program = require("../models/program.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Payment = require("../models/payment.model");
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
      passingQuestions,
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
      passingQuestions: Number(passingQuestions),
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
    const programs = await Program.find({
      isDeleted: false,
    })
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

    console.log("========== UPDATE PROGRAM ==========");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const {
      name,
      category,
      originalPrice,
      sellingPrice,
      totalQuestions,
      examDuration,
      passingQuestions,
      description,
      status,
    } = req.body || {};

    // ------------------------------------
    // Find program
    // ------------------------------------

    const program = await Program.findById(id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    // ------------------------------------
    // Check duplicate name
    // ------------------------------------

    const existingProgram = await Program.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });

    if (existingProgram) {
      return res.status(409).json({
        success: false,
        message: "Program name already exists.",
      });
    }

    // ------------------------------------
    // Update normal fields
    // ------------------------------------

    program.name = name.trim();

    program.category = category;

    program.originalPrice = Number(originalPrice);

    program.sellingPrice = Number(sellingPrice);

    program.totalQuestions = Number(totalQuestions);

    program.examDuration = Number(examDuration);

    program.description = description || "";

    program.passingQuestions = Number(passingQuestions);

    program.isActive = status === "Active";

    // ------------------------------------
    // Thumbnail
    // ------------------------------------

    const thumbnail = req.files?.thumbnail?.[0];

    if (thumbnail) {
      console.log("New thumbnail:", thumbnail);

      // Delete old thumbnail
      if (program.thumbnail) {
        const oldThumbnailPath = path.join(
          process.cwd(),
          program.thumbnail.replace(/^\/+/, ""),
        );

        console.log("Old thumbnail path:", oldThumbnailPath);

        if (fs.existsSync(oldThumbnailPath)) {
          fs.unlinkSync(oldThumbnailPath);
          console.log("Old thumbnail deleted");
        }
      }

      // Store new thumbnail path
      program.thumbnail = `/uploads/programs/${thumbnail.filename}`;
    }

    // ------------------------------------
    // Certificate Demo
    // ------------------------------------

    const certificateDemo = req.files?.certificateDemo?.[0];

    if (certificateDemo) {
      console.log("New certificate:", certificateDemo);

      // Delete old certificate
      if (program.certificateDemo) {
        const oldCertificatePath = path.join(
          process.cwd(),
          program.certificateDemo.replace(/^\/+/, ""),
        );

        console.log("Old certificate path:", oldCertificatePath);

        if (fs.existsSync(oldCertificatePath)) {
          fs.unlinkSync(oldCertificatePath);
          console.log("Old certificate deleted");
        }
      }

      // Store new certificate path
      program.certificateDemo = `/uploads/programs/certifications/${certificateDemo.filename}`;
    }

    // ------------------------------------
    // Save
    // ------------------------------------

    await program.save();

    console.log("Updated program:", program);

    return res.status(200).json({
      success: true,
      message: "Program updated successfully.",
      data: program,
    });
  } catch (error) {
    console.error("UPDATE PROGRAM ERROR:", error);

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

    if (program.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "Program is already deleted.",
      });
    }

    program.isDeleted = true;
    program.deletedAt = new Date();

    await program.save();

    // // Delete thumbnail if it exists
    // if (program.thumbnail) {
    //   const imagePath = path.join(__dirname, "../../", program.thumbnail);

    //   if (fs.existsSync(imagePath)) {
    //     fs.unlinkSync(imagePath);
    //   }
    // }

    // await Program.findByIdAndDelete(id);

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

const getWidget = async (req, res) => {
  try {
    // Start/end of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Start/end of yesterday
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const endOfYesterday = new Date(startOfToday);
    endOfYesterday.setMilliseconds(-1);

    const [
      totalStudents,
      totalPrograms,
      totalSuccessPayment,
      todayCollection,
      yesterdayCollection,
    ] = await Promise.all([
      // Total students
      User.countDocuments({
        role: "user",
      }),

      // Total programs
      Program.countDocuments(),

      // Total successful payment
      Payment.aggregate([
        {
          $match: {
            status: "paid",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Today's collection
      Payment.aggregate([
        {
          $match: {
            status: "paid",
            createdAt: {
              $gte: startOfToday,
              $lte: endOfToday,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),

      // Yesterday's collection
      Payment.aggregate([
        {
          $match: {
            status: "paid",
            createdAt: {
              $gte: startOfYesterday,
              $lte: endOfYesterday,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalPrograms,

        totalSuccessPayment: totalSuccessPayment[0]?.total || 0,

        todayCollection: todayCollection[0]?.total || 0,

        yesterdayCollection: yesterdayCollection[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Get dashboard widget error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  createProgram,
  getPrograms,
  updateProgram,
  deleteProgram,
  getProgramById,
  getWidget,
};
