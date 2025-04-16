const express = require("express");
const User = require("../models/User");
const { profileValidation } = require("../validations/users");
const router = express.Router();
const { logOut, profilePic, profile } = require("../controllers/userController");

// Middleware to protect routes
const auth = require("../middleware/auth");

// Update user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/profile", auth, profileValidation, profile);

// Update user profilePic
const upload = require("../middleware/fileUpload");

router.put(
  "/profilePic",
  auth,
  profileValidation,
  upload.array("file", 2),
  profilePic
);

// Logout
router.get("/logout", auth, logOut);

module.exports = router;
