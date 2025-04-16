const { stripe, paymentSession } = require("../generics/stripe");

const createPaymentSession = async () => {
  const items = [
    { name: "NodeJS", price: "300", quantity: 1 },
    { name: "ExpressJS", price: "600", quantity: 2 },
  ];

  const line_items = items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await paymentSession(line_items);
  return session;
};

const handlePaymentSuccess = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent.payment_method"],
  });

  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

  return { session, lineItems };
};

module.exports = {
  createPaymentSession,
  handlePaymentSuccess,
};
