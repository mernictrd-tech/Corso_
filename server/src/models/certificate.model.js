const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Name entered by student during certificate payment
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },

    attempt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssessmentAttempt",
      required: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },

    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    corsoId: {
      type: String,
      required: true,
      index: true,
    },

    documentIdentifier: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Issued", "Revoked"],
      default: "Issued",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Certificate",
    certificateSchema
  );