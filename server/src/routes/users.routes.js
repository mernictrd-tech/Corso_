const express = require("express");
const router = express.Router();

const {
    getMyCertificate
} = require("../controllers/users/heroSection.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/my-certificate", authMiddleware, getMyCertificate);

module.exports = router;
