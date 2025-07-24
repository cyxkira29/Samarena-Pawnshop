<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST");
header('Content-Type: application/json');

include('database.php'); // Make sure database.php has a valid MySQLi connection

$last_name = isset($_GET['last_name']) ? trim($_GET['last_name']) : '';

if (!$last_name) {
    echo json_encode(["error" => "Last name is required"]);
    exit;
}

try {
    // Prepare the SQL query using MySQLi
    $query = "SELECT Customer_ID, Customer_FirstName FROM tbl_customer WHERE Customer_LastName LIKE ?";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        echo json_encode(["error" => "Query preparation failed: " . $conn->error]);
        exit;
    }

    $search = "%$last_name%"; // Adding wildcards for partial match
    $stmt->bind_param("s", $search);
    $stmt->execute();
    
    $result = $stmt->get_result();
    
    // Fetch all results into an array
    $customers = [];
    while ($row = $result->fetch_assoc()) {
        $customers[] = $row;
    }

    echo json_encode($customers);
} catch (Exception $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
