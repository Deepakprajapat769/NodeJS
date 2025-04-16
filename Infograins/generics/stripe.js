const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

const paymentSession = async (items) => {
  try {
    const session = await stripe.checkout.sessions.create({
      // payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: `${process.env.BASE_URL}/payment/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/paymnet/paymentCancel`,
    });
    return session;
  } catch (error) {
    throw new Error(`Stripe session creation failed: ${error.message}`);
  }
};

module.exports = { stripe,paymentSession };
