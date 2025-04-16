const fs = require("fs");
const jwt = require("jsonwebtoken");

const clearFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
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
