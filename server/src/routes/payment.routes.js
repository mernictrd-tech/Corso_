const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  createPaymentOrder,
  verifyPayment,
  manualPayment
} = require("../controllers/payment.controller");

router.post(
  "/create-order",
  createPaymentOrder
);

router.post(
  "/verify",
  verifyPayment
);

// Manual payment (Admin only)
router.post(
  "/manual-verify",
  manualPayment
);

module.exports = router;