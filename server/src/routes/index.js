const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const assessmentRoutes = require("./assessment.routes");
const paymentRoutes = require("./payment.routes");
const userRoutes = require("./users.routes");

const {
  getPrograms,
  getProgramBySlug,
} = require("../controllers/client/program.controller");

const { getCategories } = require("../controllers/client/category.controller");
const { createContactValidation } = require("../validations/contact.validation");
const validate = require("../middleware/validate.middleware");
const { createContact } = require("../controllers/client/contact.controller");

// Health Check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully 🚀",
  });
});

// Authentication Routes
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/assessment", assessmentRoutes);
router.use("/payment", paymentRoutes);
router.use("/users", userRoutes);

// Routes

router.get("/program/list", getPrograms);
router.get("/category/list", getCategories);

router.get("/program/slug/:slug", getProgramBySlug);

// Contact Form
router.post("/contact", createContactValidation, validate, createContact);

module.exports = router;
