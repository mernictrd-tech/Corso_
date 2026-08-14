const Certificate = require("../../models/certificate.model.js");
const Assessment = require("../../models/assessment.model.js");
const User = require("../../models/user.model.js");

const getMyCertificate = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        // 1. Search for Certificate for current logged-in user
        let certificate = await Certificate.findOne({
            user: userId
        })
          .sort({ createdAt: -1 })
          .populate("program", "name slug");

        // 2. Search for Assessment for current logged-in user
        let assessment = await Assessment.findOne({
            student: userId
        })
          .sort({ createdAt: -1 })
          .populate("program", "name slug");

        const currentUser = await User.findById(userId).select("fullName email");

        // Fallback: If no certificate found for current user, fetch the latest certificate in DB
        if (!certificate && !assessment) {
            certificate = await Certificate.findOne()
                .sort({ createdAt: -1 })
                .populate("program", "name slug");
        }

        if (!certificate && !assessment) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Certificate not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                studentName: certificate?.studentName || currentUser?.fullName || "Student",
                programName: certificate?.program?.name || assessment?.program?.name || "React.js",
                certificateId: certificate?.certificateId || "N/A",
                issuedDate: certificate?.issueDate || certificate?.createdAt || assessment?.createdAt,
                score: certificate?.score ?? assessment?.score ?? null,
                totalQuestions: assessment?.totalQuestions ?? null,
                hasCertificate: !!certificate
            }
        });

    } catch (error) {
        console.error("getMyCertificate error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMyCertificate
};

