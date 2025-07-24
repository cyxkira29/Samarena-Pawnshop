<?php
include 'database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]);
    exit;
}

if (!isset($_GET['item_id']) || empty($_GET['item_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing Item ID"]);
    exit;
}

$item_id = intval($_GET['item_id']);

// ✅ Fetch item details
$query = "
    SELECT 
        i.Item_ID, 
        i.Pawnticket_ID, 
        i.Item_Value, 
        i.Interest
    FROM tbl_item i
    WHERE i.Item_ID = ? AND i.Is_Hidden = 0";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $item_id);
$stmt->execute();
$result = $stmt->get_result();
$item = $result->fetch_assoc();

if ($item) {
    echo json_encode([
        "status" => "success",
        "item_id" => $item["Item_ID"],
        "pawnticket_id" => $item["Pawnticket_ID"],
        "item_value" => $item["Item_Value"],
        "interest" => $item["Interest"]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Item not found"]);
}

$stmt->close();
$conn->close();
?>
