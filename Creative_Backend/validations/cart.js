const { body, param, query } = require("express-validator");

const cartValidation = [
  body("productId").notEmpty().withMessage("productId is required"),
  body("quantity").notEmpty().isInt().withMessage("quantity is required"),
];


module.exports = {
  cartValidation
};
