const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload.middleware");

const protect = require("../middleware/auth.middleware");

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
const { getAllContacts, updateContactStatus, deleteContact } = require("../controllers/contact.controller");
const { adminLogin } = require("../controllers/admin.controller");
const adminProtect = require("../middleware/adminProtect.middleware");

////////////////////////  Admin Login  ///////////////////////

router.post("/login", adminLogin);

////////////////////////  Dashboard Widget ///////////////////////

router.get("/dashboard/widgets", adminProtect, getWidget);

////////////////////////   Program Routes ///////////////////////

router.post(
  "/program/store",
  adminProtect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "certificateDemo", maxCount: 1 },
  ]),
  createProgram,
);

router.get("/program/list", adminProtect, getPrograms);

router.get("/program/:id", adminProtect, getProgramById);

router.put(
  "/program/update/:id",
  adminProtect,
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

router.delete("/program/delete/:id", adminProtect, deleteProgram);

////////////////////////   Program Topic Routes ///////////////////////

router.post("/topic/store", adminProtect, createTopic);

router.get(
  "/topic/program/:programId",
  adminProtect,
  getTopicsByProgram,
);

router.get("/topic/:id", adminProtect, getTopicById);

router.put("/topic/:id", adminProtect, updateTopic);

router.delete("/topic/delete/:id", adminProtect, deleteTopic);

////////////////////////   Question Routes ///////////////////////

router.post("/question/create", adminProtect, createQuestion);

router.delete("/question/delete/:id", adminProtect, deleteQuestion);

router.put("/question/update/:id", adminProtect, updateQuestion);

router.get("/question/view/:id", adminProtect, getQuestionById);

router.get(
  "/program/:programId/questions",
  adminProtect,
  
  getQuestionsByProgram,
);

////////////////////////  Categories    ////////////////////////////

router.post("/category/store", adminProtect, createCategory);

router.get("/category/list", adminProtect, getCategories);

router.get("/category/:id", adminProtect, getCategoryById);

router.put("/category/update/:id", adminProtect, updateCategory);

router.delete("/category/delete/:id", adminProtect, deleteCategory);

////////////////////////  Global Search ////////////////////////////

router.get("/students/search", adminProtect, searchStudents);

////////////////////////    Students    ////////////////////////////

router.get("/students/list", adminProtect, getStudents);

router.delete("/student/delete/:id", adminProtect, deleteStudent);

router.get("/students/:studentId", adminProtect, getStudentDetails);

////////////////////////  Payment List  ////////////////////////////

router.get("/payments/list", adminProtect, getAllPayments);

////////////////////////  Contact List  ////////////////////////////

router.get("/contacts/list", adminProtect, getAllContacts);

router.patch("/contacts/:id/status", adminProtect, updateContactStatus);

router.delete("/contact/delete/:id", adminProtect, deleteContact);

module.exports = router;
