const mysql = require("mysql2");

const connectDB = () => {
  const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err.message);
      process.exit(1); // Exit process with failure
    } else {
      console.log("MySQL connected");
    }
  });

  return db.promise(); // Use promise-based queries
};

module.exports = connectDB;
