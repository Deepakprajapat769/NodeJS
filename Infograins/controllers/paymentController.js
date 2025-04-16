const paymentService = require("../services/paymentService");
const {
  successResponse,
  errorResponse,
} = require("../generics/responseHandler");

const createPaymentIntent = async (req, res) => {
  try {
    const session = await paymentService.createPaymentSession();
    return successResponse(res, "Payment session created", { url: session.url });
    // Or redirect if frontend is not consuming response:
    // return res.redirect(session.url);
  } catch (error) {
    return errorResponse(res, "Failed to create payment session", 500, error.message);
  }
};

const paymentSuccess = async (req, res) => {
  try {
    const { session, lineItems } = await paymentService.handlePaymentSuccess(
      req.query.session_id
    );

    return successResponse(res, "Payment was successful", {
      session,
      lineItems,
    });
  } catch (error) {
    return errorResponse(res, "Failed to retrieve payment details", 500, error.message);
  }
};

const paymentCancel = async (req, res) => {
  // Optionally you can render or redirect with a message
  return successResponse(res, "Payment cancelled by user");
};

module.exports = {
  createPaymentIntent,
  paymentSuccess,
  paymentCancel,
};
