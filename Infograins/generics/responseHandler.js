exports.successResponse = (res, message, data = {}, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

exports.errorResponse = (res, message, status = 500, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    error,
  });
};

exports.validationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors,
  });
};
