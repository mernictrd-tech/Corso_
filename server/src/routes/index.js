const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const assessmentRoutes = require("./assessment.routes");
const paymentRoutes = require("./payment.routes");
const {
   getPrograms,
   getProgramBySlug
   } = require("../controllers/client/program.controller");

const { getCategories } = require("../controllers/client/category.controller");

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

// Routes

router.get("/program/list", getPrograms);
router.get("/category/list", getCategories);
router.use("/assessment", assessmentRoutes);
router.use("/payment", paymentRoutes);

router.get("/program/slug/:slug", getProgramBySlug);

module.exports = router;