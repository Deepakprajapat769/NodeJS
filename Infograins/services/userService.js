const User = require("../models/User");
const { clearFile } = require("../generics/utilities");

exports.updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const { name, email } = updateData;

  if (name) user.name = name;
  if (email) {
    user.email = email;
    user.isVerified = false;
  }

  await user.save();
  return { requiresLogout: !!email };
};

exports.updateProfilePicture = async (userId, files) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.profile = files.map((file) => file.path);
  await user.save();
};

exports.logout = () => {
  return { message: "Logout successful" };
};
