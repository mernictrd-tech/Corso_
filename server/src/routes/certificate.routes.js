const express = require("express");
const router = express.Router();

const { verifyCertificate } = require("../controllers/certificate.controller");

// Public Certificate Verification
router.get("/verify/:certificateId", verifyCertificate);

module.exports = router;
