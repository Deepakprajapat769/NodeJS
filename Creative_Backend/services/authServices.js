const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../generics/responseHandler");
const { clearFile } = require("../generics/utilities");
const path = require("path");

const signupService = async (req, res) => {
  const db = req.db;
  const { userName, email, password } = req.body;

  try {
    const checkUserQuery = `SELECT * FROM users WHERE userName = ? OR email = ?`;
    const [existingUser] = await db.execute(checkUserQuery, [userName, email]);

    if (existingUser.length > 0) {
      return errorResponse(res, "UserName or Email already in use", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `INSERT INTO users (userName, email, password) VALUES (?, ?, ?)`;
    const [result] = await db.execute(insertQuery, [
      userName,
      email,
      hashedPassword,
    ]);

    return successResponse(res, "Signup successful", { userId: result.insertId });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const loginService = async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [user] = await db.execute(query, [email]);

    if (user.length === 0) {
      return errorResponse(res, "Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return errorResponse(res, "Invalid password", 400);
    }

    const token = jwt.sign(
      { id: user[0].id, email: user[0].email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    return successResponse(res, "Login successful", { token });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const fetchProfileService = async (req, res) => {
  try {
    const db = req.db;
    const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);

    if (!users.length) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User profile fetched successfully", users[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const deleteProfileService = async (req, res) => {
  const db = req.db;

  try {
    if (!req.user.id) {
      return errorResponse(res, "User ID not provided", 400);
    }

    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);

    if (!user.length) {
      return errorResponse(res, "User not found", 404);
    }

    const coverImages = JSON.parse(user[0].coverImages || "[]");
    coverImages.forEach((image) => {
      clearFile(path.join(__dirname, "../public/assets/uploads", image));
    });

    const profileImages = JSON.parse(user[0].profileImages || "[]");
    profileImages.forEach((image) => {
      clearFile(path.join(__dirname, "../public/assets/uploads", image));
    });

    await db.execute("DELETE FROM users WHERE id = ?", [req.user.id]);

    return successResponse(res, "User deleted successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const editProfileService = async (req, res) => {
  try {
    const db = req.db;
    const userId = req.user.id;

    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (!user.length) {
      return errorResponse(res, "User not found", 404);
    }

    const profileImage =
      req.files?.profileImage?.[0]?.filename || user[0].profileImages;
    const coverImage =
      req.files?.coverImage?.[0]?.filename || user[0].coverImages;

    if (
      req.files?.profileImage &&
      user[0].profileImages !== profileImage &&
      user[0].profileImages
    ) {
      clearFile(
        path.join(__dirname, "../public/assets/uploads", user[0].profileImages)
      );
    }

    if (
      req.files?.coverImage &&
      user[0].coverImages !== coverImage &&
      user[0].coverImages
    ) {
      clearFile(
        path.join(__dirname, "../public/assets/uploads", user[0].coverImages)
      );
    }

    const updateQuery = `
      UPDATE users 
      SET profileImages = ?, coverImages = ? 
      WHERE id = ?
    `;
    await db.execute(updateQuery, [profileImage, coverImage, userId]);

    return successResponse(res, "Profile updated successfully");
  } catch (error) {
    if (req.files?.profileImage) {
      req.files.profileImage.forEach((file) => clearFile(file.path));
    }
    if (req.files?.coverImage) {
      req.files.coverImage.forEach((file) => clearFile(file.path));
    }
    console.error(error);
    return errorResponse(res, "Server error", 500);
  }
};

module.exports = {
  signupService,
  loginService,
  fetchProfileService,
  deleteProfileService,
  editProfileService,
};
