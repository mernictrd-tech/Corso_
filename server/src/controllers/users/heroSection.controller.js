const Certificate = require("../../models/certificate.model.js");
const Assessment = require("../../models/assessment.model.js");
const User = require("../../models/user.model.js");
const Payment = require("../../models/payment.model.js");

const getMyCertificate = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        console.log("Fetching all dashboard data for userId:", userId);

        // 1. Get current user
        const currentUser = await User.findById(userId)
            .select("-password");

        // 2. Get ALL certificates
        const allCertificates = await Certificate.find({
            user: userId
        })
            .sort({ createdAt: -1 })
            .populate("program", "name slug");

        // 3. Get ALL assessments
        const allAssessments = await Assessment.find({
            student: userId
        })
            .sort({ createdAt: -1 })
            .populate("program", "name slug");

        // 4. Get ALL payments
        const allPayments = await Payment.find({
            student: userId
        })
            .sort({ createdAt: -1 })
            .populate("program", "name slug")
            .populate("assessment");

        // 5. Combine certificate + assessment + payment
        const certificatesWithAssessments = allCertificates.map(
            (certificate) => {

                const relatedAssessment = allAssessments.find(
                    (assessment) =>
                        assessment.program?._id?.toString() ===
                        certificate.program?._id?.toString()
                );

                const relatedPayment = allPayments.find(
                    (payment) =>
                        payment.program?._id?.toString() ===
                        certificate.program?._id?.toString()
                );

                return {
                    ...certificate.toObject(),

                    assessment: relatedAssessment
                        ? relatedAssessment.toObject()
                        : null,

                    payment: relatedPayment
                        ? relatedPayment.toObject()
                        : null
                };
            }
        );

        return res.status(200).json({
            success: true,

            data: {
                user: currentUser,

                certificates: allCertificates,

                assessments: allAssessments,

                payments: allPayments,

                certificatesWithAssessments,

                totalCertificates: allCertificates.length,

                totalAssessments: allAssessments.length,

                totalPayments: allPayments.length
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