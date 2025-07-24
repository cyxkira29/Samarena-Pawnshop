<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'database.php';

// ✅ Handle CORS Preflight Requests
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// ✅ Ensure POST method is used
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    exit;
}

// ✅ Read JSON request body
$data = json_decode(file_get_contents("php://input"), true);
if (empty($data['item_id']) || empty($data['auction_price'])) {
    echo json_encode(["status" => "error", "message" => "Missing Item ID or Auction Price"]);
    exit;
}
function resetAutoIncrement($conn, $table) {
    $result = $conn->query("SELECT COUNT(*) AS count FROM $table");
    $row = $result->fetch_assoc();
    if ($row['count'] == 0) {
        $conn->query("ALTER TABLE $table AUTO_INCREMENT = 1");
    }
}
resetAutoIncrement($conn, "tbl_auctioned_items");

$item_id = intval($data['item_id']);
$auction_price = floatval($data['auction_price']);

$conn->begin_transaction();

try {
    // ✅ Fetch item details from `tbl_item`
    $stmt = $conn->prepare("SELECT Description, Net_Value FROM tbl_item WHERE Item_ID = ?");
    $stmt->bind_param("i", $item_id);
    $stmt->execute();
    $stmt->bind_result($description, $net_value);
    $stmt->fetch();
    $stmt->close();

    if (!$description) {
        throw new Exception("Item not found or already moved.");
    }

    // ✅ Insert item into `tbl_auctioned_items` with a new unique `Auction_ID`
    $stmt = $conn->prepare("INSERT INTO tbl_auctioned_items (Item_ID, Item_Value, Description, Net_Value) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("idss", $item_id, $auction_price, $description, $net_value);
    
    if (!$stmt->execute() || $stmt->affected_rows === 0) {
        throw new Exception("Failed to insert into auction table.");
    }
    $stmt->close();

    // ✅ Mark the item as hidden instead of deleting it
    $stmt = $conn->prepare("UPDATE tbl_item SET Is_Hidden = 1 WHERE Item_ID = ?");
    $stmt->bind_param("i", $item_id);
    if (!$stmt->execute() || $stmt->affected_rows === 0) {
        throw new Exception("Failed to update item visibility.");
    }
    $stmt->close();

    // ✅ Commit transaction
    $conn->commit();
    echo json_encode(["status" => "success", "message" => "Item moved to auction and hidden successfully."]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

$conn->close();
?>
