// routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createPaymentIntent,
  paymentSuccess,
  paymentCancel,
} = require("../controllers/paymentController");

// Payment Page View
router.get("/create-payment-intent", (req, res) => {
  res.render("payment");
});

// Payment Process
router.post("/create-payment-intent", auth, createPaymentIntent);
router.get("/paymentSuccess", paymentSuccess);
router.get("/paymentCancel", auth, paymentCancel);

module.exports = router;
