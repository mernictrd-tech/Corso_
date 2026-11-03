
const mongoose = require("mongoose");

const Assessment = require("../models/assessment.model");
const Payment = require("../models/payment.model");

// GET /admin/assessments/list
const getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find()
      .populate("student", "name email")
      .populate("program")
      .sort({ createdAt: -1 })
      .lean();

    if (!assessments.length) {
      return res.status(200).json({
        success: true,
        message: "No assessments found",
        data: [],
      });
    }

    const assessmentIds = assessments.map(
      (assessment) => assessment._id
    );

    // Fetch all payments associated with these assessments
    const payments = await Payment.find({
      assessment: { $in: assessmentIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    // Group payments by assessment ID
    const paymentMap = new Map();

    payments.forEach((payment) => {
      const assessmentId = payment.assessment.toString();

      if (!paymentMap.has(assessmentId)) {
        paymentMap.set(assessmentId, []);
      }

      paymentMap.get(assessmentId).push(payment);
    });

    // Attach payment information to assessments
    const result = assessments.map((assessment) => {
      const assessmentId = assessment._id.toString();

      const assessmentPayments =
        paymentMap.get(assessmentId) || [];

      // A successful payment takes priority over failed/created attempts
      const paidPayment = assessmentPayments.find(
        (payment) => payment.status === "paid"
      );

      // Otherwise, use the latest payment attempt
      const latestPayment = assessmentPayments[0] || null;

      const payment = paidPayment || latestPayment;

      return {
        ...assessment,

        // Payment information
        paymentStatus: paidPayment ? "paid" : "unpaid",
        paymentAmount: payment?.amount || 0,
        paymentCurrency: payment?.currency || "INR",
        paymentDate: paidPayment?.paidAt || null,

        // Latest payment attempt information
        latestPaymentStatus: latestPayment?.status || null,
        razorpayOrderId: latestPayment?.razorpayOrderId || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Assessments fetched successfully",
      total: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get Assessments Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assessments",
      error: error.message,
    });
  }
};

module.exports = {
  getAssessments,
};
