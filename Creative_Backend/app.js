require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors")
const connectDB = require("./config/db"); // Import the database connection
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart")
const app = express();

// Database connection
const db = connectDB();

// Middleware
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())

// Set up EJS
app.set("view engine", "ejs");

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use("/auth", authRoutes);
app.use("/product",productRoutes);
app.use("/cart",cartRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error("Messages ::",err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
