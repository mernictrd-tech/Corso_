const crypto = require("crypto");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

const Payment = require("../models/payment.model");
const Certificate = require("../models/certificate.model");
const Assessment = require("../models/assessment.model");
const Program = require("../models/program.model");
const userModel = require("../models/user.model");
const axios = require("axios");

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

    // ---------------------------------------------------------
    // Get certificate price
    // ---------------------------------------------------------

    const certificateFee = Number(program.sellingPrice);

    if (!certificateFee || certificateFee <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid certificate fee for this program.",
      });
    }

    // ---------------------------------------------------------
    // Clean customer details
    // ---------------------------------------------------------

    const customerName = name.trim();
    const customerEmail = email.trim().toLowerCase();
    const customerMobile = mobile.trim();

    // ---------------------------------------------------------
    // Create Razorpay order
    // ---------------------------------------------------------

    const receipt = `cert_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: certificateFee * 100,
      currency: "INR",
      receipt,

      notes: {
        assessmentId: assessmentId.toString(),
        programId: programId.toString(),

        studentName: customerName,
        studentEmail: customerEmail,
        studentMobile: customerMobile,
      },
    });

    // ---------------------------------------------------------
    // Save payment record
    // ---------------------------------------------------------

    const payment = await Payment.create({
      program: programId,
      assessment: assessmentId,

      customerName,
      customerEmail,
      customerMobile,

      amount: certificateFee,
      currency: "INR",

      razorpayOrderId: order.id,

      status: "created",
    });

    // ---------------------------------------------------------
    // Response
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
          name: customerName,
          email: customerEmail,
          mobile: customerMobile,
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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

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
    // Find payment
    // ---------------------------------------------------------

    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found.",
      });
    }

    // ---------------------------------------------------------
    // Prevent duplicate verification
    // ---------------------------------------------------------

    if (payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been verified.",
      });
    }

    // ---------------------------------------------------------
    // Verify Razorpay signature
    // ---------------------------------------------------------

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

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
    // Find existing user OR create new user
    // ---------------------------------------------------------

    let student = await userModel.findOne({
      email: payment.customerEmail,
    });

    let shouldFetchTid = false;

    if (!student) {
      student = await userModel.create({
        fullName: payment.customerName,
        email: payment.customerEmail,
        phone: payment.customerMobile,
        password: crypto.randomBytes(10).toString("hex"),
        termsAccepted: true,
      });

      shouldFetchTid = true;
    } else if (!student.tid) {
      shouldFetchTid = true;
    }

    // ---------------------------------------------------------
    // Link payment to student
    // ---------------------------------------------------------

    payment.student = student._id;

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
    // Prevent duplicate certificate
    // ---------------------------------------------------------

    let certificate = await Certificate.findOne({
      payment: payment._id,
    });

    // ---------------------------------------------------------
    // Create certificate
    // ---------------------------------------------------------

    if (!certificate) {
      const certificateId =
        `SKLM-${new Date().getFullYear()}-` +
        crypto.randomBytes(4).toString("hex").toUpperCase();

      const documentIdentifier =
        `DOC-${Date.now()}-` +
        crypto.randomBytes(3).toString("hex").toUpperCase();

      certificate = await Certificate.create({
        user: student._id,

        studentName: payment.customerName,

        program: program._id,

        attempt: assessment._id,

        payment: payment._id,

        certificateId,

        documentIdentifier,

        score: assessment.score,

        issueDate: new Date(),

        status: "Issued",
      });
    }

    const response = await axios.post(
      process.env.TID_API_URL,
      {
        email: student.email,
        name: student.fullName,
        phone: student.phone,
        parent_institute: "SKILIUM.IN",
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("TID API response:", response.data);

    const tid = response.data?.TID;

    if (!tid) {
      console.error(`TID not received for ${email}`);
      return;
    }

    await userModel.findByIdAndUpdate(
      student._id,
      {
        $set: {
          tid: tid,
        },
      },
      {
        new: true,
      },
    );

    await Certificate.findByIdAndUpdate(
      certificate._id,
      {
        $set: {
          tid: tid,
        },
      },
      {
        new: true,
      },
    );

    // let tid = "";
    // if (shouldFetchTid) {
    //   tid = await fetchAndUpdateTid(
    //     student._id,
    //     certificate._id,
    //     student.email,
    //     student.fullName,
    //     student.phone,
    //   ).catch((error) => {
    //     console.error("Background TID update failed:", error);
    //   });
    // }

    // ---------------------------------------------------------
    // Success
    // ---------------------------------------------------------
    // console.log(tid);
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
          documentIdentifier: certificate.documentIdentifier,
          studentName: certificate.studentName,
          programName: program.name,
          score: certificate.score,
          issueDate: certificate.issueDate,
          status: certificate.status,
          tid: tid,
          date: certificate.issueDate
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

const fetchAndUpdateTid = async (studentId, certId, email, name, phone) => {
  try {
    const response = await axios.post(
      process.env.TID_API_URL,
      {
        email: email,
        name: name,
        phone: phone,
        parent_institute: "SKILIUM.IN",
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log("TID API response:", response.data);

    const tid = response.data?.TID;

    if (!tid) {
      console.error(`TID not received for ${email}`);
      return;
    }

    await userModel.findByIdAndUpdate(
      studentId,
      {
        $set: {
          tid: tid,
        },
      },
      {
        new: true,
      },
    );

    await Certificate.findByIdAndUpdate(
      certId,
      {
        $set: {
          tid: tid,
        },
      },
      {
        new: true,
      },
    );

    console.log(`TID ${tid} saved for ${email}`);

    return tid;
  } catch (error) {
    console.error(
      `TID API error for ${email}:`,
      error.response?.data || error.message,
    );
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
