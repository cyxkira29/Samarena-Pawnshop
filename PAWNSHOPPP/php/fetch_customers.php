<?php
// Allow all origins (you can restrict this to specific origins if needed)
header("Access-Control-Allow-Origin: *");
// Allow specific headers if necessary (Content-Type is needed for JSON requests)
header("Access-Control-Allow-Headers: Content-Type");
// Allow the methods you want (GET, POST, etc.)
header("Access-Control-Allow-Methods: UPDATE,GET, POST");

// Include the database connection file
include('database.php');

// SQL query to fetch customer data including the Status column
$sql = "SELECT Customer_ID, Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Birthday, Customer_Address, Customer_Nationality, Customer_Gender, Status FROM tbl_customer"; 

$result = $conn->query($sql);

$customers = [];

if ($result->num_rows > 0) {
    // Fetch all the customer data
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }

    // Send the response as JSON
    echo json_encode(['status' => 'success', 'data' => $customers]);
} else {
    // If no customers are found
    echo json_encode(['status' => 'error', 'message' => 'No customers found.']);
}

// Close the database connection
$conn->close();
?>
    