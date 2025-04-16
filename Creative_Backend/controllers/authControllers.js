const { validationResult } = require("express-validator");
const authServices = require("../services/authServices");
const { clearFile } = require("../generics/utilities");
const {errorResponse, validationError } = require("../generics/responseHandler");

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }
    await authServices.signupService(req, res);
  } catch (error) {
    console.error("Signup Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, errors.array());
    }
    await authServices.loginService(req, res);
  } catch (error) {
    console.error("Login Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

exports.fetchProfile = async (req, res) => {
  try {
    await authServices.fetchProfileService(req, res);
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return errorResponse(res, "User ID not provided", 400);
    }
    await authServices.deleteProfileService(req, res);
  } catch (error) {
    console.error("Delete Profile Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};

exports.editProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.files?.profileImage) {
        req.files.profileImage.forEach((file) => clearFile(file.path));
      }
      if (req.files?.coverImage) {
        req.files.coverImage.forEach((file) => clearFile(file.path));
      }
      return validationError(res, errors.array());
    }
    await authServices.editProfileService(req, res);
  } catch (error) {
    if (req.files?.profileImage) {
      req.files.profileImage.forEach((file) => clearFile(file.path));
    }
    if (req.files?.coverImage) {
      req.files.coverImage.forEach((file) => clearFile(file.path));
    }
    console.error("Edit Profile Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};
