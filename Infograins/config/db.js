const mongoose = require("mongoose");

const connectDB =() => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("Err",err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
