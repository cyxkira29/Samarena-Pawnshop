<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'database.php';

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['item_id']) || empty($data['sold_price']) || empty($data['customer_id'])) {
    echo json_encode(["status" => "error", "message" => "Missing Item ID, Sold Price, or Customer ID"]);
    exit;
}
function resetAutoIncrement($conn, $table) {
    $result = $conn->query("SELECT COUNT(*) AS count FROM $table");
    $row = $result->fetch_assoc();
    if ($row['count'] == 0) {
        $conn->query("ALTER TABLE $table AUTO_INCREMENT = 1");
    }
}

resetAutoIncrement($conn, "tbl_sold_items");


$item_id = intval($data['item_id']);
$sold_price = floatval($data['sold_price']);
$customer_id = intval($data['customer_id']);

$conn->begin_transaction();

try {
    $conn->query("SET FOREIGN_KEY_CHECKS=0");
    // ✅ Insert into `tbl_sold_items` with correct column names
    $stmt = $conn->prepare("INSERT INTO tbl_sold_items (Item_ID, Sale_Price, Sold_Date, Customer_ID) VALUES (?, ?, NOW(), ?)");
    $stmt->bind_param("ids", $item_id, $sold_price, $customer_id);
    if (!$stmt->execute() || $stmt->affected_rows === 0) {
        throw new Exception("Failed to insert into sold items table.");
    }
    $stmt->close();

    // ✅ Remove item from `tbl_auctioned_items`
    $stmt = $conn->prepare("DELETE FROM tbl_auctioned_items WHERE Item_ID = ?");
    $stmt->bind_param("i", $item_id);
    if (!$stmt->execute() || $stmt->affected_rows === 0) {
        throw new Exception("Failed to remove from auctioned items.");
    }
    $stmt->close();

    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Item moved to sold successfully."]);
    $conn->query("SET FOREIGN_KEY_CHECKS=1");
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
