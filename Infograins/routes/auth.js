// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  signupValidation,
  loginValidation,
} = require("../validations/auth");

const {
  signup,
  verifyEmail,
  sendVerifyMail,
  login,
} = require("../controllers/authController");

// Signup page and submit
router.get("/signup", (req, res) => res.render("signup"));
router.post("/signup", signupValidation, signup);

// Email Verification
router.get("/verify/:token", verifyEmail);
router.get("/sendVerifymail", (req, res) => res.render("sendVerifymail"));
router.post("/sendVerifymail", sendVerifyMail);

// Login page and submit
router.get("/login", (req, res) => res.render("login"));
router.post("/login", loginValidation, login);

module.exports = router;
