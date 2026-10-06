const express = require("express");
const router = express.Router();

const { verifyCertificate, generateCertificate } = require("../controllers/certificate.controller");

// Public Certificate Verification
router.get("/verify/:certificateId", verifyCertificate);
router.get("/:certificateId", generateCertificate);

module.exports = router;
