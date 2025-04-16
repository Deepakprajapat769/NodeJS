// controllers/productController.js
const { validationResult } = require("express-validator");
const productServices = require("../services/productServices");

const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await productServices.createProductService(req, res);
  } catch (err) {
    console.error("Create Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const fetchProduct = async (req, res) => {
  try {
    await productServices.fetchProductService(req, res);
  } catch (err) {
    console.error("Fetch Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productServices.deleteProductService(req, res);
  } catch (err) {
    console.error("Delete Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files?.length) {
      req.files.forEach((file) => clearFile(file.path));
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    await productServices.updateProductService(req, res);
  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  fetchProduct,
  deleteProduct,
  updateProduct,
};
