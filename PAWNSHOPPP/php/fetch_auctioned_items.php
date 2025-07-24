<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

require 'database.php'; // Ensure this file connects to MySQL

// Handle CORS Preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$query = "SELECT Item_ID, Item_Value, Description, Net_Value FROM tbl_auctioned_items";
$result = $conn->query($query);

$auctionedItems = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $auctionedItems[] = $row;
    }
    echo json_encode(["status" => "success", "items" => $auctionedItems]);
} else {
    echo json_encode(["status" => "error", "message" => "No auctioned items found."]);
}

$conn->close();
?>
