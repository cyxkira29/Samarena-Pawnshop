<?php
include 'database.php';

// ✅ Allow requests from any origin (or restrict to specific domains)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// ✅ Handle preflight request for CORS (OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ✅ Check database connection
if (!$conn) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . mysqli_connect_error()]);
    exit;
}

// ✅ Check if item_id is provided
if (!isset($_GET['item_id'])) {
    echo json_encode(["status" => "error", "message" => "No item ID provided"]);
    exit;
}

$item_id = intval($_GET['item_id']);

// ✅ Query to fetch the required columns
$query = "
    SELECT 
        ri.Item_ID, 
        ri.Pawnticket_ID, 
        i.Item_Value, 
        i.Description, 
        i.Interest, 
        i.Net_Value, 
        i.category, 
        r.Maturity_Date, 
        r.Expiration_Date 
    FROM tbl_renewed_items ri
    LEFT JOIN tbl_item i ON ri.Item_ID = i.Item_ID
    LEFT JOIN tbl_pawnticket pt ON ri.Pawnticket_ID = pt.Pawnticket_ID
    LEFT JOIN tbl_payment p ON pt.Pawnticket_ID = p.Pawnticket_ID  -- ✅ Correct Join
    LEFT JOIN tbl_renew r ON r.Payment_ID = p.Payment_ID  -- ✅ Now r.Payment_ID is correctly matched
    WHERE ri.Item_ID = ?";



$stmt = $conn->prepare($query);
$stmt->bind_param("i", $item_id);
$stmt->execute();
$result = $stmt->get_result();
$item = $result->fetch_assoc();

// ✅ Return JSON response
if ($item) {
    echo json_encode([
        "status" => "success",
        "item_id" => $item["Item_ID"], 
        "pawnticket_id" => $item["Pawnticket_ID"], 
        "item_value" => $item["Item_Value"], 
        "description" => $item["Description"], 
        "interest" => $item["Interest"], 
        "net_value" => $item["Net_Value"], 
        "category" => $item["category"], 
        "maturity_date" => $item["Maturity_Date"], 
        "expiry_date" => $item["Expiration_Date"]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Item not found"]);
}

$stmt->close();
$conn->close();
?>
