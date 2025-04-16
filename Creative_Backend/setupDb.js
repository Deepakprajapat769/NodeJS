require('dotenv').config();
const connectDB = require('./config/db');

(async () => {
  const db = connectDB();

  try {
    // Create Database Query
    const createDBQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE};`;

    // Create Table Queries
    const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userName VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      profileImages VARCHAR(255),
      coverImages VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    const createProductsTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      SKU INT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );`;

    const createCartsTableQuery = `
    CREATE TABLE cart (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );`;
    

    // Execute the database creation query
    await db.query(createDBQuery);
    console.log('Database created successfully');

    // Change the database
    await db.query(`USE ${process.env.MYSQL_DATABASE}`);

    // Execute the table creation queries
    await db.query(createUsersTableQuery);
    console.log('Users table created successfully');

    await db.query(createProductsTableQuery);
    console.log('Products table created successfully');
    
    await db.query(createCartsTableQuery);
    console.log('Carts table created successfully');

  } catch (err) {
    console.error('Error creating database or table:', err.message);
  } finally {
    db.end(); // Close the database connection
  }
})();
