const { body, param, query } = require("express-validator");

const profileValidation = [
  body("name").optional(),
  body("email")
    .optional()
    .isEmail()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    .withMessage("Enter a valid email"),
];

module.exports = {
  profileValidation,
};
