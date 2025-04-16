const express = require("express");
// const db = require("../config/db")();
const { productValidation, productParam } = require("../validations/product");
const router = express.Router();
const {
  createProduct,
  fetchProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// Middleware to protect routes
const auth = require("../middleware/auth");

// Create Product Route
router.post("/create", auth, productValidation, createProduct);

// Get Products Route
router.get("/fetch", auth, fetchProduct);

// Delete Product Route
router.delete("/delete/:id", productParam, auth, deleteProduct);

// Update Product Route
router.put("/update/:id", productParam, auth, updateProduct);

module.exports = router;
