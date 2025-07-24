const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,   // Change this if your MySQL uses a different port
    user: 'root', // Change if you have a different user
    password: '', // Leave blank if you have no password
    database: 'samarena_pawnshop'
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as ID " + connection.threadId);
});

module.exports = connection;
