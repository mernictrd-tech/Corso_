const Program = require("../../models/program.model");
const User = require("../../models/user.model");
const Certificate = require("../../models/certificate.model");
const Assessment = require("../../models/assessment.model");

const cardStatus = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Get logged-in user
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // --------------------------------------------------
    // 1. CERTIFICATES
    // --------------------------------------------------
    const certificates = await Certificate.countDocuments({
      user: userId,
    });

    // --------------------------------------------------
    // 2. ASSESSMENTS
    // --------------------------------------------------
    const assessments = await Assessment.countDocuments({
      student: userId,
    });

    // --------------------------------------------------
    // 3. PASS RATE
    // --------------------------------------------------
    const assessmentData = await Assessment.find({
      student: userId,
    })
      .select("score status result percentage")
      .lean();

    let passedAssessments = 0;

    assessmentData.forEach((assessment) => {
      // Adjust this condition according to your Assessment schema
      if (
        assessment.status === "passed" ||
        assessment.result === "passed" ||
        (assessment.score !== undefined && assessment.score >= 40) ||
        (assessment.percentage !== undefined &&
          assessment.percentage >= 40)
      ) {
        passedAssessments++;
      }
    });

    const passRate =
      assessments > 0
        ? Math.round((passedAssessments / assessments) * 100)
        : 0;

    // --------------------------------------------------
    // 4. SKILLS VERIFIED
    // --------------------------------------------------
    let skillsVerified = 0;

    // If skills are stored directly in User
    if (Array.isArray(user.skills)) {
      skillsVerified = user.skills.filter(
        (skill) =>
          skill.verified === true ||
          skill.isVerified === true
      ).length;
    }

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------
    return res.status(200).json({
      success: true,
      data: {
        certificates,
        assessments,
        passRate,
        skillsVerified,
      },
    });
  } catch (error) {
    console.error("Card Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard card status",
      error: error.message,
    });
  }
};

module.exports = {
  cardStatus,
};