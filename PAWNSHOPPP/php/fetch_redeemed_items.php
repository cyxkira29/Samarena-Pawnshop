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

// ✅ Verify if tables exist
$tableCheckQuery = "SHOW TABLES LIKE 'tbl_redeemed_items'";
$tableExists = $conn->query($tableCheckQuery);
$itemTableCheckQuery = "SHOW TABLES LIKE 'tbl_item'";
$itemTableExists = $conn->query($itemTableCheckQuery);

if ($tableExists->num_rows == 0 || $itemTableExists->num_rows == 0) {
    echo json_encode(["status" => "error", "message" => "One or both tables do not exist!"]);
    exit;
}

// ✅ Fetch Redeemed Items with Item Details
$sql = "SELECT r.Redeemed_ID, r.Pawnticket_ID, r.Item_Value, r.Redeemed_Value, r.Redeemed_Date,
               IFNULL(i.Description, 'N/A') AS Description, 
               IFNULL(i.category, 'N/A') AS Category
        FROM tbl_redeemed_items r
        LEFT JOIN tbl_item i ON r.Pawnticket_ID = i.Pawnticket_ID
        AND r.Item_Value = i.Item_Value
        ORDER BY r.Redeemed_Date ASC";


$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["status" => "error", "message" => "Database query failed: " . $conn->error]);
    exit;
}

// ✅ Fetch data
$items = [];
while ($row = $result->fetch_assoc()) {
    $row['Item_Value'] = number_format((float) $row['Item_Value'], 2, '.', '');
    $row['Redeemed_Value'] = number_format((float) $row['Redeemed_Value'], 2, '.', '');
    $row['Redeemed_Date'] = date("Y-m-d H:i:s", strtotime($row['Redeemed_Date']));
    $row['Description'] = $row['Description'] ?? 'N/A';
    $row['Category'] = $row['Category'] ?? 'N/A';
    $items[] = $row;
}

// ✅ Return JSON response
echo json_encode([
    "status" => !empty($items) ? "success" : "error",
    "items"  => !empty($items) ? $items : []
], JSON_PRETTY_PRINT);

$conn->close();
?>
