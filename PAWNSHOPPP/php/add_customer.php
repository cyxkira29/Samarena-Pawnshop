<?php
// Enable CORS for cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request for CORS preflight
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

// Enable error reporting (disable in production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'database.php'; // Ensure database.php is included

header("Content-Type: application/json");

// Read raw JSON input
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Check if JSON is valid
if ($data === null) {
    echo json_encode(["status" => "error", "message" => "❌ Invalid JSON format."]);
    exit();
}
// Check if the table is empty
$result = $conn->query("SELECT COUNT(*) AS count FROM tbl_customer");
$row = $result->fetch_assoc();

if ($row['count'] == 0) {
    // Reset AUTO_INCREMENT to 1
    $conn->query("ALTER TABLE tbl_customer AUTO_INCREMENT = 1");
}

// Extract form data (Customer_ID is removed since it's auto-increment)
$firstname = isset($data['firstname']) ? trim($data['firstname']) : '';
$middle_initial = isset($data['middle_initial']) ? trim($data['middle_initial']) : '';
$lastname = isset($data['lastname']) ? trim($data['lastname']) : '';
$birthday = isset($data['birthday']) ? trim($data['birthday']) : '';
$address = isset($data['address']) ? trim($data['address']) : '';
$nationality = isset($data['nationality']) ? trim($data['nationality']) : '';
$gender = isset($data['gender']) ? trim($data['gender']) : '';

// Check required fields
if (empty($firstname) || empty($lastname) || empty($birthday) || empty($address) || empty($nationality) || empty($gender)) {
    echo json_encode(["status" => "error", "message" => "❌ All required fields must be filled."]);
    exit();
}

// Insert into database WITHOUT Customer_ID (auto-incremented)
$stmt = $conn->prepare("INSERT INTO tbl_customer 
    (Customer_FirstName, Customer_MiddleInitial, Customer_LastName, Customer_Birthday, Customer_Address, Customer_Nationality, Customer_Gender) 
    VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $firstname, $middle_initial, $lastname, $birthday, $address, $nationality, $gender);

// Execute statement
if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "✅ Customer added successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "❌ Error adding customer: " . $stmt->error]);
}

// Close resources
$stmt->close();
$conn->close();
exit();
?>
