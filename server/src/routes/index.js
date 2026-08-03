const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");

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

module.exports = router;