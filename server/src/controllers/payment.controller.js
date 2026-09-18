const crypto = require("crypto");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");

const Payment = require("../models/payment.model");
const Certificate = require("../models/certificate.model");
const Assessment = require("../models/assessment.model");
const Program = require("../models/program.model");
const userModel = require("../models/user.model");
const axios = require("axios");

const {
  sendCertificateEmail,
} = require("../services/certificateEmail.service");
const { saveCertificatePNG } = require("../services/certificate.service");
const { sendEmail } = require("../services/ses.service");

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
    let isNewStudent = false;
    let temporaryPassword = null;

    if (!student) {
      temporaryPassword = crypto.randomBytes(10).toString("hex");

      student = await userModel.create({
        fullName: payment.customerName,
        email: payment.customerEmail,
        phone: payment.customerMobile,
        password: temporaryPassword,
        termsAccepted: true,
      });
      isNewStudent = true;
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

    student = await userModel.findByIdAndUpdate(
      student._id,
      {
        $set: {
          tid: tid,
        },
      },
      { returnDocument: "after" },
    );
    console.log(student);

    await Certificate.findByIdAndUpdate(
      certificate._id,
      {
        $set: {
          tid: tid,
        },
      },
      { returnDocument: "after" },
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

    const generatedCertificate = await saveCertificatePNG({
      _id: certificate._id,
      certificateId: certificate.certificateId,
      studentName: student.fullName,
      tid: student.tid,
      programName: program.name,
      issueDate: certificate.issueDate,
      documentIdentifier: certificate.documentIdentifier,
    });

    void sendCertificateEmail({
      email: student.email,
      studentName: student.fullName,
      programName: program.name,
      tid: student.tid,
      score: assessment.score * 10,
      certificateId: certificate.certificateId,
      certificateFilePath: generatedCertificate.filePath,
    })
      .then((result) => {
        console.log("Certificate email sent:", result.messageId);
      })
      .catch((error) => {
        console.error("Certificate email failed:", error);
      });

    if (isNewStudent && temporaryPassword) {
      void sendCredentialEmail({
        email: student.email,
        studentName: student.fullName,
        password: temporaryPassword,
      })
        .then((result) => {
          console.log("Credential email sent:", result.messageId);
        })
        .catch((error) => {
          console.error("Credential email failed:", error);
        });
    }

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
          date: certificate.issueDate,
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

const sendCredentialEmail = async ({ email, studentName, password }) => {
  const subject = "Your Skilium Account Credentials";

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Your Skilium Account Credentials</title>
    </head>

    <body style="
      margin: 0;
      padding: 0;
      background: #f4f7fb;
      font-family: Arial, Helvetica, sans-serif;
      color: #1e293b;
    ">
      <div style="
        max-width: 650px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
      ">

        <!-- Header -->
        <div style="
          padding: 28px;
          text-align: center;
          background: #07111f;
        ">
          <img
            src="https://skilium.in/assets/skilium-logo-without-bg-DARK.png"
            alt="Skilium"
            width="150"
            style="
              display: block;
              width: 150px;
              max-width: 100%;
              height: auto;
              margin: 0 auto;
              border: 0;
            "
          />
        </div>

        <!-- Main Content -->
        <div style="padding: 35px 30px;">

          <h2 style="
            margin-top: 0;
            color: #0f172a;
          ">
            Welcome to Skilium, ${studentName}!
          </h2>

          <p style="
            font-size: 16px;
            line-height: 1.7;
            color: #475569;
          ">
            Your Skilium account has been created successfully.
            You can now use your account to access your certification
            information and other available services.
          </p>

          <!-- Account Credentials -->
          <div style="
            margin: 25px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          ">

            <p style="
              margin: 8px 0;
              font-size: 15px;
              color: #334155;
            ">
              <strong>Email:</strong>
              ${email}
            </p>

            <p style="
              margin: 8px 0;
              font-size: 15px;
              color: #334155;
            ">
              <strong>Password:</strong>
              ${password}
            </p>

          </div>

          <p style="
            font-size: 15px;
            line-height: 1.7;
            color: #475569;
          ">
            Please use the credentials above to log in to your Skilium
            account.
          </p>

          <!-- Login Button -->
          <div style="
            text-align: center;
            margin: 30px 0;
          ">
            <a
              href="https://skilium.in/"
              style="
                display: inline-block;
                padding: 13px 24px;
                background: #06b6d4;
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Login to Skilium
            </a>
          </div>

          <!-- Security Notice -->
          <div style="
            margin: 25px 0;
            padding: 16px 18px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
          ">

            <p style="
              margin: 0;
              font-size: 14px;
              line-height: 1.6;
              color: #475569;
            ">
              <strong style="color: #0f172a;">
                Security Notice
              </strong>
              <br />
              For your security, please change your password after
              logging in for the first time. Do not share your login
              credentials with anyone.
            </p>

          </div>

          <p style="
            font-size: 13px;
            color: #64748b;
            line-height: 1.6;
          ">
            If you did not expect this account to be created, please
            contact the Skilium support team.
          </p>

        </div>

        <!-- Footer -->
        <div style="
          padding: 20px 30px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          text-align: center;
        ">
          <p style="
            margin: 0;
            font-size: 12px;
            color: #64748b;
          ">
            This is an automated email from Skilium.
            Please do not reply to this email.
          </p>
        </div>

      </div>
    </body>
  </html>
`;

  return sendEmail({
    to: email,
    subject,
    html,
  });
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
