const express = require("express");
const router = express.Router();

const {
    getMyCertificate
} = require("../controllers/users/heroSection.controller");

const {
    cardStatus
} = require("../controllers/users/cardStatus.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/my-certificate", authMiddleware, getMyCertificate);
router.get("/card-status", authMiddleware, cardStatus);

module.exports = router;
