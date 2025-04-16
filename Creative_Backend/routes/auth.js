const express = require("express");
const router = express.Router();
// const db = require("../config/db")();
const {
  signupValidation,
  loginValidation,
  authParam,
} = require("../validations/auth");

// Middleware to protect routes
const auth = require("../middleware/auth");

// Controllers
const {
  signup,
  login,
  fetchProfile,
  editProfile,
  deleteProfile,
} = require("../controllers/authControllers");

// const upload = require("../middleware/fileUpload");
const multer = require("multer");
const path = require("path");

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/assets/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Register
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", signupValidation, signup);

// Login
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", loginValidation, login);

// Get Profile

router.get("/fetchProfile", auth, fetchProfile);

// Delete Profile

router.delete("/deleteProfile", auth, deleteProfile);

//Edit Profile

// Edit Profile Route
router.put(
  "/editProfile",
  auth,
  upload.fields([{ name: "profileImage" }, { name: "coverImage" }]),
  editProfile
);

module.exports = router;
