const { body, param, query } = require("express-validator");
const productValidation = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("price").trim().notEmpty().isInt().withMessage("price is required"),
  body("description").trim().notEmpty().withMessage("description is required"),
  body("SKU").trim().notEmpty().withMessage("SKU is required"),
];

const productParam = [param("id").trim().isInt().withMessage("id is required")];
module.exports = {
  productValidation,
  productParam,
};
