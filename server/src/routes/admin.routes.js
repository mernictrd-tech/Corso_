const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const protect = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  createProgram,
  updateProgram,
  deleteProgram,
  getPrograms,
} = require("../controllers/program.controller");

router.post("/program/store", protect, adminMiddleware, upload.single("thumbnail"), createProgram);

// router.get("/program/list", protect, adminMiddleware, getPrograms);

// router.put("/program/update/:id", protect, adminMiddleware, updateProgram);

// router.delete("/program/delete/:id", protect, adminMiddleware, deleteProgram);

module.exports = router;