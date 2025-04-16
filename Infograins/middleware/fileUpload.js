const multer = require("multer");
const fs = require("fs");
const path = require("path");

const fileSystem = (dirPath) => {
  try {
    let file = path.join(__dirname, `../${dirPath}`);
    if (!fs.existsSync(file)) {
      fs.mkdirSync(file);
    }
  } catch (error) {
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (req.url.includes("users/profilePic")) {
      fileSystem("public/assets/profile");
      cb(null, "public/assets/profile");
    }
    cb(null, "public/assets/profile/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
    // file.mimetype === "application/octet-stream"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file format"), false);
  }
};

module.exports = multer({ fileFilter: fileFilter, storage: storage });
