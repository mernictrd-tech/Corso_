  const Certificate = require("../models/certificate.model");
const Program = require("../models/program.model");
const Assessment = require("../models/assessment.model");

/*
|--------------------------------------------------------------------------
| Verify Certificate Public Endpoint
|--------------------------------------------------------------------------
*/
const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId || typeof certificateId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required.",
      });
    }

    const cleanId = certificateId.trim();

    // Match case-insensitively across certificateId, corsoId, or documentIdentifier
    const certificate = await Certificate.findOne({
      $or: [
        { certificateId: { $regex: new RegExp(`^${cleanId}$`, "i") } },
        { corsoId: { $regex: new RegExp(`^${cleanId}$`, "i") } },
        { documentIdentifier: { $regex: new RegExp(`^${cleanId}$`, "i") } },
      ],
    })
      .populate("program", "name slug description")
      .populate("user", "name email");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: `No certificate found matching ID "${cleanId}". Please verify and try again.`,
      });
    }

    // FETCH ASSESSMENT
    const assessment = await Assessment.findOne({
    student: certificate.user?._id,
    })
    .sort({ createdAt: -1 })
    .populate("program", "name slug");

    return res.status(200).json({
      success: true,
      message: "Certificate verified successfully.",
      data: {
        certificateId: certificate.certificateId,
        corsoId: certificate.corsoId,
        documentIdentifier: certificate.documentIdentifier,
        studentName: certificate.studentName || certificate.user?.name,
        courseName: certificate.program?.name || "Technical Certification",
        programSlug: certificate.program?.slug,
        score: certificate.score,
        totalQuestions: assessment?.totalQuestions || 0,
        issueDate: certificate.issueDate,
        status: certificate.status || "Issued",
        isVerified: certificate.status === "Issued",
      },
    });
  } catch (error) {
    console.error("Certificate verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying certificate.",
      error: error.message,
    });
  }
};

module.exports = {
  verifyCertificate,
};
