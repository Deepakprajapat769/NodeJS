require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors")
const connectDB = require("./config/db"); // Import the database connection
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payment")
const app = express();

// Database connection
connectDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())
// Middleware to set user
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Set up EJS
app.set("view engine", "ejs");

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/payment", paymentRoutes);


// Error handling
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: `Internal Server Error :- ${err.message}`  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
