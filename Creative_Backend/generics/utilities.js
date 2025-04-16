const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const path = require("path");


const clearFile = (filePath) => {
  if (!filePath || typeof filePath !== "string") {
    console.error("Invalid file path:", filePath);
    return;
  }

  fs.unlink(filePath, (err) => {
    if (err)console.error("Failed to delete file:", err);
  });
};

const generateAuthTokens = (userData) => {
  return jwt.sign({userData}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

module.exports = {
  clearFile,
  generateAuthTokens,
};
