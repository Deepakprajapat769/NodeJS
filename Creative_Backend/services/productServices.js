// services/productServices.js
const {
  successResponse,
  errorResponse,
} = require("../generics/responseHandler");
const { clearFile } = require("../generics/utilities");

const createProductService = async (req, res) => {
  const db = req.db;
  const { name, description, price, SKU } = req.body;

  try {
    // Check if SKU already exists
    const skuQuery = `SELECT * FROM products WHERE SKU = ?`;
    const [product] = await db.execute(skuQuery, [SKU]);

    if (product.length > 0) {
      return errorResponse(res, "SKU already exists", 400);
    }

    // Ensure req.user.id is set by auth middleware
    if (!req.user || !req.user.id) {
      return errorResponse(res, "Unauthorized: User ID missing", 401);
    }

    // Insert the new product
    const query = `
      INSERT INTO products (user_id, name, description, price, SKU) 
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(query, [
      req.user.id, // Ensure user ID is passed correctly
      name,
      description,
      price,
      SKU,
    ]);

    return successResponse(res, "Product added successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const fetchProductService = async (req, res) => {
  const db = req.db;

  try {
    const [products] = await db.execute(
      "SELECT * FROM products WHERE user_id = ?",
      [req.user.id]
    );

    return successResponse(res, "Products fetched successfully", {
      Products: products,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const deleteProductService = async (req, res) => {
  const db = req.db;
  const productId = req.params.id;

  try {
    // Check if product exists for the user
    const [product] = await db.execute(
      "SELECT * FROM products WHERE id = ? AND user_id = ?",
      [productId, req.user.id]
    );

    if (!product.length) {
      return errorResponse(res, "Product not found", 404);
    }

    // Delete product from the database
    await db.execute("DELETE FROM products WHERE id = ? AND user_id = ?", [
      productId,
      req.user.id,
    ]);

    return successResponse(res, "Product deleted successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const updateProductService = async (req, res) => {
  const db = req.db;
  const productId = req.params.id;
  const { name, description, price, SKU } = req.body;

  try {
    // Check if product exists for the user
    const [existingProduct] = await db.execute(
      "SELECT * FROM products WHERE id = ? AND user_id = ?",
      [productId, req.user.id]
    );

    if (!existingProduct.length) {
      return errorResponse(res, "Product not found", 404);
    }

    if (SKU) {
      const skuQuery = `SELECT * FROM products WHERE SKU = ? AND id != ?`;
      const [product] = await db.execute(skuQuery, [SKU, productId]);

      if (product.length > 0) {
        return errorResponse(res, "SKU already exists", 400);
      }
    }

    // Build the dynamic update query based on fields provided
    const fieldsToUpdate = [];
    const values = [];

    if (name) {
      fieldsToUpdate.push("name = ?");
      values.push(name);
    }
    if (description) {
      fieldsToUpdate.push("description = ?");
      values.push(description);
    }
    if (price) {
      fieldsToUpdate.push("price = ?");
      values.push(price);
    }
    if (SKU) {
      fieldsToUpdate.push("SKU = ?");
      values.push(SKU);
    }

    if (fieldsToUpdate.length === 0) {
      return errorResponse(res, "No fields provided for update", 400);
    }

    const updateQuery = `
      UPDATE products 
      SET ${fieldsToUpdate.join(", ")}
      WHERE id = ? AND user_id = ?
    `;

    values.push(productId, req.user.id);

    await db.execute(updateQuery, values);

    return successResponse(res, "Product updated successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

module.exports = {
  createProductService,
  fetchProductService,
  deleteProductService,
  updateProductService,
};
