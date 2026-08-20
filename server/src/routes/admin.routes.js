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
  getWidget,
} = require("../controllers/program.controller");

const {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionById,
  getQuestionsByProgram,
} = require("../controllers/question.controller");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const {
  getStudents,
  deleteStudent,
  getStudentDetails,
  searchStudents,
} = require("../controllers/student.controller");

const {
  createTopic,
  getTopicsByProgram,
  getTopicById,
  updateTopic,
  deleteTopic,
} = require("../controllers/topic.controller");
const { getAllPayments } = require("../controllers/payment.controller");

////////////////////////  Dashboard Widget ///////////////////////

router.get("/dashboard/widgets", protect, adminMiddleware, getWidget);

////////////////////////   Program Routes ///////////////////////

router.post(
  "/program/store",
  protect,
  adminMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "certificateDemo", maxCount: 1 },
  ]),
  createProgram,
);

router.get("/program/list", protect, adminMiddleware, getPrograms);

router.get("/program/:id", protect, adminMiddleware, getProgramById);

router.put(
  "/program/update/:id",
  protect,
  adminMiddleware,
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
    {
      name: "certificateDemo",
      maxCount: 1,
    },
  ]),
  updateProgram,
);

router.delete("/program/delete/:id", protect, adminMiddleware, deleteProgram);

////////////////////////   Program Topic Routes ///////////////////////

router.post("/topic/store", protect, adminMiddleware, createTopic);

router.get(
  "/topic/program/:programId",
  protect,
  adminMiddleware,
  getTopicsByProgram,
);

router.get("/topic/:id", protect, adminMiddleware, getTopicById);

router.put("/topic/:id", protect, adminMiddleware, updateTopic);

router.delete("/topic/delete/:id", protect, adminMiddleware, deleteTopic);

////////////////////////   Question Routes ///////////////////////

router.post("/question/create", protect, adminMiddleware, createQuestion);

router.delete("/question/delete/:id", protect, adminMiddleware, deleteQuestion);

router.put("/question/update/:id", protect, adminMiddleware, updateQuestion);

router.get("/question/view/:id", protect, adminMiddleware, getQuestionById);

router.get(
  "/program/:programId/questions",
  protect,
  adminMiddleware,
  getQuestionsByProgram,
);

////////////////////////  Categories    ////////////////////////////

router.post("/category/store", protect, adminMiddleware, createCategory);

router.get("/category/list", protect, adminMiddleware, getCategories);

router.get("/category/:id", protect, adminMiddleware, getCategoryById);

router.put("/category/update/:id", protect, adminMiddleware, updateCategory);

router.delete("/category/delete/:id", protect, adminMiddleware, deleteCategory);

////////////////////////  Global Search ////////////////////////////

router.get("/students/search", protect, adminMiddleware, searchStudents);

////////////////////////    Students    ////////////////////////////

router.get("/students/list", protect, adminMiddleware, getStudents);

router.delete("/student/delete/:id", protect, adminMiddleware, deleteStudent);

router.get("/students/:studentId", protect, adminMiddleware, getStudentDetails);

////////////////////////  Payment List  ////////////////////////////

router.get("/payments/list", protect, adminMiddleware, getAllPayments);

module.exports = router;
