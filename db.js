// db.js
const mysql = require("mysql2");
require("dotenv").config();

// Buat koneksi ke database
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",       // host MySQL
  user: process.env.DB_USER || "root",            // user MySQL
  password: process.env.DB_PASSWORD || "Asti22##",        // password MySQL
  database: process.env.DB_NAME || "project_api", // nama database
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise agar bisa pakai async/await
module.exports = pool.promise();
