const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");

// Health Check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully 🚀",
  });
});

// Authentication Routes
router.use("/auth", authRoutes);

module.exports = router;