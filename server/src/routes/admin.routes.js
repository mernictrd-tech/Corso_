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
  getProgramById,
} = require("../controllers/program.controller");

const {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionById,
  getQuestionsByProgram,
} = require("../controllers/question.controller");

////////////////////////   Program Routes ///////////////////////

router.post(
  "/program/store",
  protect,
  adminMiddleware,
  upload.single("thumbnail"),
  createProgram,
);

router.get("/program/list", protect, adminMiddleware, getPrograms);

router.get("/program/:id", protect, adminMiddleware, getProgramById);

router.put("/program/update/:id", protect, adminMiddleware, updateProgram);

router.delete("/program/delete/:id", protect, adminMiddleware, deleteProgram);

////////////////////////   Question Routes ///////////////////////

router.post("/question/store", protect, adminMiddleware, createQuestion);

router.delete("/question/delete/:id", protect, adminMiddleware, deleteQuestion);

router.put("/question/update/:id", protect, adminMiddleware, updateQuestion);

router.get("/question/view/:id", protect, adminMiddleware, getQuestionById);

router.get("/program/:programId/questions", protect, adminMiddleware, getQuestionsByProgram,);

module.exports = router;
