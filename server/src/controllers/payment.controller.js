const crypto = require("crypto");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

const Payment = require("../models/payment.model");
const Certificate = require("../models/certificate.model");
const Assessment = require("../models/assessment.model");
const Program = require("../models/program.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*
|--------------------------------------------------------------------------
| Create Razorpay Order
|--------------------------------------------------------------------------
*/

const createPaymentOrder = async (req, res) => {
  try {
    const studentId = req.user._id;

    const { assessmentId, programId, name, email, mobile } = req.body;

    // ---------------------------------------------------------
    // Validate input
    // ---------------------------------------------------------

    if (!assessmentId || !programId || !name || !email || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Assessment, program and user details are required.",
      });
    }

    // ---------------------------------------------------------
    // Validate IDs
    // ---------------------------------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(assessmentId) ||
      !mongoose.Types.ObjectId.isValid(programId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid assessment or program ID.",
      });
    }

    // ---------------------------------------------------------
    // Verify passed assessment
    // ---------------------------------------------------------

    const assessment = await Assessment.findOne({
      _id: assessmentId,
      student: studentId,
      program: programId,
      passed: true,
    });

    if (!assessment) {
      return res.status(403).json({
        success: false,
        message:
          "You must pass the assessment before purchasing the certificate.",
      });
    }

    // ---------------------------------------------------------
    // Verify program
    // ---------------------------------------------------------

    const program = await Program.findById(programId);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found.",
      });
    }

    // -------------------------------------------------------
    // Get Program Price
    // -------------------------------------------------------

    const certificateFee = Number(program.sellingPrice);

    if (!certificateFee || certificateFee <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate fee for this program.",
      });
    }

    // ---------------------------------------------------------
    // Create Razorpay order
    // ---------------------------------------------------------

    const receipt = `cert_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: certificateFee * 100,
      currency: "INR",
      receipt,

      notes: {
        studentId: studentId.toString(),

        assessmentId: assessmentId.toString(),

        programId: programId.toString(),

        studentName: name.trim(),

        studentEmail: email.trim(),

        studentMobile: mobile.trim(),
      },
    });

    // ---------------------------------------------------------
    // Save payment record
    // ---------------------------------------------------------

    const payment = await Payment.create({
      student: studentId,

      program: programId,

      assessment: assessmentId,

      amount: certificateFee,

      currency: "INR",

      razorpayOrderId: order.id,

      status: "created",
    });

    // ---------------------------------------------------------
    // Send order to frontend
    // ---------------------------------------------------------

    return res.status(200).json({
      success: true,

      message: "Payment order created.",

      data: {
        paymentId: payment._id,

        orderId: order.id,

        amount: order.amount,

        currency: order.currency,

        key: process.env.RAZORPAY_KEY_ID,

        student: {
          name,
          email,
          mobile,
        },

        program: {
          id: program._id,

          name: program.name,
        },
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to create payment order.",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Verify Razorpay Payment
|--------------------------------------------------------------------------
*/

const verifyPayment = async (req, res) => {
  try {
    const studentId = req.user._id;

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,

      // Details entered in PaymentPopup
      customer,
    } = req.body;

    // ---------------------------------------------------------
    // Validate Razorpay response
    // ---------------------------------------------------------

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,

        message: "Payment verification details are missing.",
      });
    }

    // ---------------------------------------------------------
    // Find our payment
    // ---------------------------------------------------------

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,

      student: studentId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,

        message: "Payment record not found.",
      });
    }

    // ---------------------------------------------------------
    // Generate Razorpay signature
    // ---------------------------------------------------------

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${payment.razorpayOrderId}|${razorpay_payment_id}`)
      .digest("hex");

    // ---------------------------------------------------------
    // Timing safe verification
    // ---------------------------------------------------------

    const generatedBuffer = Buffer.from(generatedSignature, "utf8");

    const receivedBuffer = Buffer.from(razorpay_signature, "utf8");

    const isValid =
      generatedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(generatedBuffer, receivedBuffer);

    if (!isValid) {
      payment.status = "failed";

      await payment.save();

      return res.status(400).json({
        success: false,

        message: "Payment verification failed.",
      });
    }

    // ---------------------------------------------------------
    // Mark payment as paid
    // ---------------------------------------------------------

    payment.status = "paid";

    payment.razorpayPaymentId = razorpay_payment_id;

    payment.razorpaySignature = razorpay_signature;

    payment.paidAt = new Date();

    await payment.save();

    // ---------------------------------------------------------
    // Get assessment
    // ---------------------------------------------------------

    const assessment = await Assessment.findById(payment.assessment);

    if (!assessment || !assessment.passed) {
      return res.status(400).json({
        success: false,

        message: "Valid passed assessment not found.",
      });
    }

    // ---------------------------------------------------------
    // Get program
    // ---------------------------------------------------------

    const program = await Program.findById(payment.program);

    if (!program) {
      return res.status(404).json({
        success: false,

        message: "Program not found.",
      });
    }

    // ---------------------------------------------------------
    // Student details
    //
    // Priority:
    // 1. Payment popup details
    // 2. Logged-in user's details
    // ---------------------------------------------------------

    const studentName =
      customer?.fullName?.trim() ||
      req.user.fullName ||
      req.user.name ||
      "Student";

    const studentEmail = customer?.email?.trim() || req.user.email || "";

    const studentMobile = customer?.mobile?.trim() || "";

    // ---------------------------------------------------------
    // Prevent duplicate certificate
    // ---------------------------------------------------------

    let certificate = await Certificate.findOne({
      payment: payment._id,
    });

    // ---------------------------------------------------------
    // Create certificate
    // ---------------------------------------------------------

    if (!certificate) {
      // -------------------------------------------------------
      // Certificate ID
      // -------------------------------------------------------

      const certificateId =
        `CRSO-${new Date().getFullYear()}-` +
        crypto.randomBytes(4).toString("hex").toUpperCase();

      // -------------------------------------------------------
      // Corso ID
      // -------------------------------------------------------

      const corsoId =
        `CORSO-${new Date().getFullYear()}-` +
        crypto.randomBytes(4).toString("hex").toUpperCase();

      // -------------------------------------------------------
      // Document Identifier
      // -------------------------------------------------------

      const documentIdentifier =
        `DOC-${Date.now()}-` +
        crypto.randomBytes(3).toString("hex").toUpperCase();

      // -------------------------------------------------------
      // Create Certificate
      // -------------------------------------------------------

      certificate = await Certificate.create({
        // Required Certificate fields
        user: studentId,

        studentName: studentName,

        program: program._id,

        /*
         * Your current assessment flow stores the completed
         * assessment in Assessment.
         *
         * Certificate schema requires an ObjectId for `attempt`.
         * Using the completed assessment ID here keeps the
         * certificate linked to the student's completed attempt.
         */
        attempt: assessment._id,

        payment: payment._id,

        certificateId: certificateId,

        corsoId: corsoId,

        documentIdentifier: documentIdentifier,

        // Assessment score
        score: assessment.score,

        // Certificate issue date
        issueDate: new Date(),

        // Certificate status
        status: "Issued",
      });
    }

    // ---------------------------------------------------------
    // Success response
    // ---------------------------------------------------------

    return res.status(200).json({
      success: true,

      message: "Payment verified and certificate generated.",

      data: {
        payment: {
          id: payment._id,

          amount: payment.amount,

          status: payment.status,

          razorpayPaymentId: payment.razorpayPaymentId,

          paidAt: payment.paidAt,
        },

        certificate: {
          id: certificate._id,

          certificateId: certificate.certificateId,

          corsoId: certificate.corsoId,

          documentIdentifier: certificate.documentIdentifier,

          studentName: certificate.studentName,

          programName: program.name,

          score: certificate.score,

          issueDate: certificate.issueDate,

          status: certificate.status,
        },
      },
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,

      message: "Payment verification failed.",

      error: error.message,
    });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "paid" })
      .populate("student", "fullName email")
      .populate("program", "name")
      .populate("assessment", "score passed")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("Get all payments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getAllPayments,
};
