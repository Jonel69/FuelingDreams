const mysql = require('mysql2/promise');
require('dotenv').config();
const mongoose = require('mongoose');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test MySQL connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database.');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB database.'))
    .catch(err => {
        console.error('MongoDB connection failed:', err);
    });

module.exports = { pool, mongoose };
