const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// ---------------------------------------------------------
// Models
// ---------------------------------------------------------

const userModel = require("../models/user.model");
const Certificate = require("../models/certificate.model");

// ---------------------------------------------------------
// Existing certificate/email functions
// ---------------------------------------------------------
// IMPORTANT:
// Change these require paths to wherever these functions
// actually exist in your project.

const {
  sendCertificateEmail,
} = require("../services/certificateEmail.service");
const { saveCertificatePNG } = require("../services/certificate.service");

// ---------------------------------------------------------
// MongoDB connection
// ---------------------------------------------------------

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

// ---------------------------------------------------------
// Fetch real TID
// ---------------------------------------------------------

const fetchTid = async (student) => {
  try {
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

    const tid = response.data?.TID;

    if (!tid) {
      throw new Error("TID API did not return TID");
    }

    return tid;
  } catch (error) {
    console.error(
      `TID API failed for ${student.email}:`,
      error.response?.data || error.message,
    );

    return null;
  }
};

// ---------------------------------------------------------
// Process one temporary TID
// ---------------------------------------------------------

const processTemporaryTid = async (student) => {
  try {
    console.log(`\nProcessing temporary TID for: ${student.email}`);

    // -----------------------------------------------------
    // Find certificate
    // -----------------------------------------------------

    const certificate = await Certificate.findOne({
      user: student._id,
      status: "Issued",
    }).sort({
      issueDate: -1,
    });

    if (!certificate) {
      console.log(`No issued certificate found for ${student.email}`);

      return;
    }

    // -----------------------------------------------------
    // Find program
    // -----------------------------------------------------

    const Program = require("../models/program.model");

    const program = await Program.findById(certificate.program);

    if (!program) {
      console.error(
        `Program not found for certificate ${certificate.certificateId}`,
      );

      return;
    }

    // -----------------------------------------------------
    // Get real TID
    // -----------------------------------------------------

    const tid = await fetchTid(student);

    if (!tid) {
      console.log(`Keeping temporary TID for ${student.email}: ${student.tid}`);

      return;
    }

    // -----------------------------------------------------
    // Update user TID
    // -----------------------------------------------------

    student = await userModel.findByIdAndUpdate(
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

    console.log(`User TID updated: ${student.email} → ${tid}`);

    // -----------------------------------------------------
    // Update certificate TID
    // -----------------------------------------------------

    const updatedCertificate = await Certificate.findByIdAndUpdate(
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

    console.log(
      `Certificate TID updated: ${updatedCertificate.certificateId} → ${tid}`,
    );

    // -----------------------------------------------------
    // Generate certificate again
    // -----------------------------------------------------

    const generatedCertificate = await saveCertificatePNG({
      _id: updatedCertificate._id,
      certificateId: updatedCertificate.certificateId,
      studentName: student.fullName,
      tid: tid,
      programName: program.name,
      issueDate: updatedCertificate.issueDate,
      documentIdentifier: updatedCertificate.documentIdentifier,
    });

    console.log(`Certificate regenerated: ${updatedCertificate.certificateId}`);

    // -----------------------------------------------------
    // Send updated certificate email
    // -----------------------------------------------------

    await sendCertificateEmail({
      email: student.email,
      studentName: student.fullName,
      programName: program.name,
      tid: tid,
      score: updatedCertificate.score * 10,
      certificateId: updatedCertificate.certificateId,
      certificateFilePath: generatedCertificate.filePath,
    });

    console.log(`Certificate email sent: ${student.email}`);

    console.log(`Completed temporary TID processing for ${student.email}`);
  } catch (error) {
    console.error(`Failed processing ${student.email}:`, error);
  }
};

// ---------------------------------------------------------
// Main cron function
// ---------------------------------------------------------

const updateTemporaryTids = async () => {
  console.log(`\n===============================================`);

  console.log(`Temporary TID cron started: ${new Date().toISOString()}`);

  console.log(`===============================================\n`);

  try {
    await connectDB();

    // -----------------------------------------------------
    // Find users with temporary TIDs
    // -----------------------------------------------------

    const students = await userModel.find({
      tid: /^TEMP\d{5,6}$/,
    });

    console.log(`Found ${students.length} student(s) with temporary TIDs.`);

    if (students.length === 0) {
      console.log("Nothing to process.");

      await mongoose.connection.close();

      return;
    }

    // -----------------------------------------------------
    // Process each student
    // -----------------------------------------------------

    for (const student of students) {
      await processTemporaryTid(student);
    }

    console.log(`\nTemporary TID cron completed: ${new Date().toISOString()}`);
  } catch (error) {
    console.error("Temporary TID cron failed:", error);
  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  }
};

// ---------------------------------------------------------
// Run
// ---------------------------------------------------------

updateTemporaryTids();
