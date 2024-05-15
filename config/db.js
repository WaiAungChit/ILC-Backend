require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs'); 

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: Buffer.from(process.env.DB_SSL_CA, 'base64').toString('utf-8'),
    }
});

db.getConnection()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Failed to connect to the database', err));

module.exports = db;