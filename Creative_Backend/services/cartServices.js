const {
  successResponse,
  errorResponse,
} = require("../generics/responseHandler");

const addToCart = async (req, res) => {
  const db = req.db;
  const { productId, quantity } = req.body;

  if (!productId || quantity <= 0) {
    return errorResponse(res, "Invalid product or quantity", 400);
  }

  try {
    // Check if product exists
    const [product] = await db.execute("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);
    if (!product.length) {
      return errorResponse(res, "Product not found", 404);
    }

    // Check if the product is already in the cart
    const [existingCartItem] = await db.execute(
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?",
      [req.user.id, productId]
    );

    if (existingCartItem.length > 0) {
      // Update the quantity if the product is already in the cart
      await db.execute(
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, req.user.id, productId]
      );
    } else {
      // Insert the product into the cart
      await db.execute(
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [req.user.id, productId, quantity]
      );
    }

    return successResponse(res, "Product added to cart successfully");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

const fetchCartItems = async (req, res) => {
  const db = req.db;

  try {
    // Fetch all cart items for the user
    const [cartItems] = await db.execute(
      `
      SELECT cart.product_id, cart.quantity, products.name, products.price
      FROM cart
      INNER JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = ?
    `,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return successResponse(res, "Cart is empty", { total: 0, cartItems: [] });
    }

    // Calculate total price
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    return successResponse(res, "Cart fetched successfully", {
      total,
      cartItems,
    });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Server error", 500);
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
};
