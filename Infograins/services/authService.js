// SERVICE: userService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendVerificationEmail } = require("../generics/mail");

exports.signup = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const user = new User({ name, email, password });
  const newUser = await user.save();
  const token = await newUser.generateAuthToken();
  await sendVerificationEmail(email, token);

  return newUser;
};

exports.verifyEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("Invalid token");
  }

  user.isVerified = true;
  await user.save();
};

exports.sendVerification = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email not registered");
  }

  const token = user.generateAuthToken();
  await sendVerificationEmail(email, token);
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  if (!user.isVerified) {
    throw new Error("Please verify your email");
  }

  const token = user.generateAuthToken();
  return { user, token };
};
