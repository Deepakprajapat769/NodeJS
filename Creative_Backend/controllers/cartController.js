// controllers/cartController.js
const { validationResult } = require("express-validator");
const cartServices = require("../services/cartServices");

const add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    await cartServices.addToCart(req, res);
  } catch (err) {
    console.error("Add to Cart Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchCart = async (req, res) => {
  try {
    await cartServices.fetchCartItems(req, res);
  } catch (err) {
    console.error("Fetch Cart Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  add,
  fetchCart,
};
