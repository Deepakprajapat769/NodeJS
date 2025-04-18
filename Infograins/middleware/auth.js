const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied login first" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Token has expired
      return res.status(401).json({ message: "Unauthorized - Token Expired" });
    } else res.status(400).json({ message: "Invalid token" });
  }
};
