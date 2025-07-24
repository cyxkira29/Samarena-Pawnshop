<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'database.php';

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    echo json_encode(["status" => "error", "message" => "Invalid request method. Use GET."]);
    exit;
}

if (!isset($_GET['pawnticket_id']) || empty($_GET['pawnticket_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing Pawnticket ID"]);
    exit;
}

$pawnticket_id = intval($_GET['pawnticket_id']);
$amount_paid = isset($_GET['amount_paid']) ? floatval($_GET['amount_paid']) : 0;

if ($pawnticket_id <= 0 || $amount_paid <= 0) {
    echo json_encode(["status" => "error", "message" => "Invalid Pawnticket ID or Amount Paid"]);
    exit;
}

// ✅ Check if tbl_redeemed_items is empty and reset AUTO_INCREMENT
$checkEmptyQuery = "SELECT COUNT(*) FROM tbl_redeemed_items";
$result = $conn->query($checkEmptyQuery);
$row = $result->fetch_array();
if ($row[0] == 0) {
    $conn->query("ALTER TABLE tbl_redeemed_items AUTO_INCREMENT = 1");
}

// ✅ Fetch Item Data (Item_Value, Description, Category)
$query = "SELECT Item_Value, Description, category FROM tbl_item WHERE Pawnticket_ID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $pawnticket_id);
$stmt->execute();
$stmt->bind_result($item_value, $description, $category);
$stmt->fetch();
$stmt->close();

// ✅ Ensure default values for missing data
$item_value = $item_value ?? 0.00;
$description = $description ?? 'N/A';
$category = $category ?? 'N/A';

// ✅ Ensure the item exists before proceeding
if ($item_value === 0.00) {
    echo json_encode(["status" => "error", "message" => "Item not found for the given Pawnticket ID."]);
    exit;
}

// ✅ Insert into tbl_redeemed_items
$insertQuery = "INSERT INTO tbl_redeemed_items (Pawnticket_ID, Item_Value, Redeemed_Value, Redeemed_Date) VALUES (?, ?, ?, NOW())";
$stmt = $conn->prepare($insertQuery);
$stmt->bind_param("idd", $pawnticket_id, $item_value, $amount_paid);

if ($stmt->execute()) {
    // ✅ Hide item in tbl_item instead of deleting
    $conn->query("UPDATE tbl_item SET Is_Hidden = 1 WHERE Pawnticket_ID = $pawnticket_id");



    // ✅ Return JSON response with full details
    echo json_encode([
        "status" => "success",
        "message" => "Item redeemed successfully. Pawnticket is now hidden instead of deleted.",
        "data" => [
            "Pawnticket_ID" => $pawnticket_id,
            "Item_Value" => $item_value,
            "Description" => $description,
            "Category" => $category,
            "Redeemed_Value" => $amount_paid,
            "Redeemed_Date" => date("Y-m-d H:i:s")
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to redeem item."]);
}

$conn->close();
?>
