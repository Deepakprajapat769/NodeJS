const { validationResult } = require("express-validator");
const profileService = require("../services/userService");
const { successResponse, errorResponse, validationError } = require("../generics/responseHandler");
const { clearFile } = require("../generics/utilities");

exports.profile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return validationError(res, errors.array());
  }

  try {
    const { requiresLogout } = await profileService.updateProfile(req.user.id, req.body);
    if (requiresLogout) {
      res.clearCookie("token");
    }
    return successResponse(res, "Profile updated");
  } catch (err) {
    return errorResponse(res, err.message, 500);
  }
};

exports.profilePic = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files.length) {
      req.files.forEach((doc) => clearFile(doc.path));
    }
    return validationError(res, errors.array());
  }

  try {
    await profileService.updateProfilePicture(req.user.id, req.files);
    return successResponse(res, "Profile Picture updated");
  } catch (err) {
    if (req.files.length) {
      req.files.forEach((doc) => clearFile(doc.path));
    }
    return errorResponse(res, err.message);
  }
};

exports.logOut = (req, res) => {
  res.clearCookie("token");
  return successResponse(res, "Logout successful");
};
