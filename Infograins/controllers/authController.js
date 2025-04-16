const { validationResult } = require("express-validator");
const userService = require("../services/authService");
const {
  successResponse,
  errorResponse,
  validationError,
} = require("../generics/responseHandler");

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());

  try {
    const user = await userService.signup(req.body);
    return successResponse(res, "Signup successful", { userId: user._id });
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const verifyEmail = async (req, res) => {
  try {
    await userService.verifyEmail(req.params.token);
    return res.render("verify", { message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return res.render("verify", {
      message: "An error occurred during verification. Please try again.",
    });
  }
};

const sendVerifyMail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());

  try {
    await userService.sendVerification(req.body.email);
    return successResponse(res, "Verification email sent");
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return validationError(res, errors.array());

  try {
    const { user, token } = await userService.login(req.body);
    res.cookie("token", token, { httpOnly: true });
    return successResponse(res, "Login successful", { token });
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};

module.exports = {
  signup,
  verifyEmail,
  sendVerifyMail,
  login,
};