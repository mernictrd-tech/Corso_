const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
  manualPayment,
  handlePartnerCallback,
  getPaymentDetails
} = require("../controllers/payment.controller");

router.post("/create-order", createPaymentOrder);

router.post("/verify", verifyPayment);

router.get("/:paymentId", getPaymentDetails);

router.post("/partner-callback", handlePartnerCallback);

// Manual payment (Admin only)
router.post("/manual-verify", manualPayment);

module.exports = router;
