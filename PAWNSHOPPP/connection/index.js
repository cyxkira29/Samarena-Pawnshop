var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '', // Use an empty string if there's no password
    database: 'samarena_pawnshop'
});

// Connect to the database
connection.connect(function (err) {
    if (err) {
        console.error("❌ Error connecting to the database: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL as ID " + connection.threadId);
});

// List of tables to check
var tables = [
    'tbl_address', 'tbl_appliance', 'tbl_barangay', 'tbl_brand',
    'tbl_city', 'tbl_condition', 'tbl_customer', 'tbl_jewelry',
    'tbl_model', 'tbl_pawnticket', 'tbl_pawnticketitem', 'tbl_street', 'tbl_type'
];

// Counter to track completed queries
let completedQueries = 0;

// Function to fetch data from each table
tables.forEach((table) => {
    let query = `SELECT * FROM ${table}`;
    
    console.log(`🔍 Running query: ${query}`); // Debugging: Show query before execution

    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error(`❌ Error fetching data from ${table}:`, err);
        } else {
            console.log(`📌 Data from ${table} (${rows.length} records):`, rows.length > 0 ? rows : "No records found.");
        }

        // Increment the counter
        completedQueries++;
        if (completedQueries === tables.length) {
            // Close the connection after all queries finish
            connection.end(function (err) {
                if (err) {
                    console.error("❌ Error closing the connection:", err);
                    return;
                }
                console.log("✅ Connection closed successfully.");
            });
        }
    });
});
