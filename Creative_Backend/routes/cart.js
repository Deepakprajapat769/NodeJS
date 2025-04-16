const express = require("express");
const { cartValidation } = require("../validations/cart");
const router = express.Router();
const { add, fetchCart } = require("../controllers/cartController");
// Middleware to protect routes
const auth = require("../middleware/auth");

router.post("/add", auth, cartValidation, add);

router.get("/", auth, fetchCart);

module.exports = router;
