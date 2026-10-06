const Certificate = require("../models/certificate.model");
const Assessment = require("../models/assessment.model");
const { generateCertificatePNG } = require("../services/certificate.service");

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

    // Match case-insensitively across certificateId, skiliumId, or documentIdentifier
    const certificate = await Certificate.findOne({
      $or: [
        { certificateId: { $regex: new RegExp(`^${cleanId}$`, "i") } },
        { skiliumId: { $regex: new RegExp(`^${cleanId}$`, "i") } },
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
        skiliumId: certificate.skiliumId,
        documentIdentifier: certificate.documentIdentifier,
        studentName: certificate.studentName || certificate.user?.name,
        courseName: certificate.program?.name || "Technical Certification",
        programSlug: certificate.program?.slug,
        score: certificate.score,
        totalQuestions: assessment?.totalQuestions || 0,
        issueDate: certificate.issueDate,
        status: certificate.status || "Issued",
        isVerified: certificate.status === "Issued",
        tid: certificate.tid,
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

const generateCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const certificate = await Certificate.findOne({
      certificateId,
    })
      .populate("user", "fullName email phone tid")
      .populate("program", "name title");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const { buffer } = await generateCertificatePNG({
      studentName: certificate.studentName || certificate.user?.fullName || "",

      programName:
        certificate.program?.name || certificate.program?.title || "",

      certificateId: certificate.certificateId,

      tid: certificate.tid || certificate.user?.tid || "",

      documentIdentifier: certificate.documentIdentifier,

      issueDate: certificate.issueDate,

      score: certificate.score,
    });

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="Skilium_Certificate_${certificateId}.png"`,
      "Content-Length": buffer.length,
      "Cache-Control": "no-store",
    });

    return res.send(buffer);
  } catch (error) {
    console.error("Certificate generation failed:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to generate certificate",
    });
  }
};

module.exports = {
  verifyCertificate,
  generateCertificate
};
