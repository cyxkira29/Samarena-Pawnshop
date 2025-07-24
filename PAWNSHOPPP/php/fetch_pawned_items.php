<?php
include 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ Check database connection
if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]);
    exit;
}

// ✅ Fetch items with their associated pawn ticket details, ordered by Item_ID
$sql = "SELECT 
            i.Item_ID, 
            i.Pawnticket_ID,  
            i.Item_Value, 
            i.Description, 
            i.Net_Value, 
            i.Category, 
            i.Interest, 
            p.Maturity_Date, 
            p.Expiry_Date
        FROM tbl_item i
        LEFT JOIN tbl_pawnticket p ON i.Pawnticket_ID = p.Pawnticket_ID  
        WHERE i.Is_Hidden = 0  -- ✅ Hide redeemed items
        ORDER BY i.Item_ID ASC";



$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["status" => "error", "message" => "Database query failed: " . $conn->error]);
    exit;
}

// ✅ Fetch results
$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

// ✅ Return JSON response
echo json_encode([
    "status" => !empty($items) ? "success" : "error",
    "items"  => !empty($items) ? $items : "No items found"
]);

$conn->close();
?>
