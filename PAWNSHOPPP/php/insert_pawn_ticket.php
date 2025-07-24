<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'database.php'; // ✅ Database Connection

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// Ensure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit();
}

// Get the JSON input
$json = file_get_contents("php://input");
$data = json_decode($json, true);

// Validate required fields
$required_fields = ['customer_id', 'category', 'description', 'item_value', 'interest', 'net_value', 'maturity_date', 'expiry_date'];

foreach ($required_fields as $field) {
    if (empty($data[$field])) {
        echo json_encode(['status' => 'error', 'message' => "Missing field: $field"]);
        exit();
    }
}

// ✅ Sanitize input
$customer_id = $conn->real_escape_string($data['customer_id']);
$category = $conn->real_escape_string($data['category']);
$description = $conn->real_escape_string($data['description']);
$item_value = floatval($data['item_value']);
$interest = floatval($data['interest']);
$net_value = floatval($data['net_value']);
$maturity_date = $conn->real_escape_string($data['maturity_date']);
$expiry_date = $conn->real_escape_string($data['expiry_date']);
$pawnticket_id = !empty($data['ticket_number']) ? intval($data['ticket_number']) : null; // Allow input or auto-increment

// ✅ Check if Customer_ID exists
$check_customer = $conn->query("SELECT Customer_ID FROM tbl_customer WHERE Customer_ID = '$customer_id'");
if ($check_customer->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Customer_ID. No matching record found.']);
    exit();
}
function resetAutoIncrement($conn, $table, $primaryKey) {
    $result = $conn->query("SELECT MAX($primaryKey) AS max_id FROM $table");
    $row = $result->fetch_assoc();
    
    if ($row['max_id'] === null) {
        $conn->query("ALTER TABLE $table AUTO_INCREMENT = 1");
    } else {
        $next_id = $row['max_id'] + 1;
        $conn->query("ALTER TABLE $table AUTO_INCREMENT = $next_id");
    }
}

// Reset AUTO_INCREMENT before inserting
resetAutoIncrement($conn, "tbl_pawnticket", "Pawnticket_ID");
resetAutoIncrement($conn, "tbl_item", "Item_ID");

// ✅ Begin Transaction
$conn->begin_transaction();

try {
    // ✅ Insert into tbl_pawnticket (Allow manual input for Pawnticket_ID if provided)
    if ($pawnticket_id) {
        $stmt_pawn = $conn->prepare("INSERT INTO tbl_pawnticket (Pawnticket_ID, Customer_ID, Principal_Value, Maturity_Date, Expiry_Date) 
                                     VALUES (?, ?, ?, ?, ?)");
        $stmt_pawn->bind_param("iidss", $pawnticket_id, $customer_id, $item_value, $maturity_date, $expiry_date);
    } else {
        $stmt_pawn = $conn->prepare("INSERT INTO tbl_pawnticket (Customer_ID, Principal_Value, Maturity_Date, Expiry_Date) 
                                     VALUES (?, ?, ?, ?)");
        $stmt_pawn->bind_param("idss", $customer_id, $item_value, $maturity_date, $expiry_date);
    }

    $stmt_pawn->execute();
    $pawnticket_id = $pawnticket_id ?: $stmt_pawn->insert_id; // Use the provided ID or auto-generated one

    // ✅ Insert into tbl_item with Pawnticket_ID
    $stmt_item = $conn->prepare("INSERT INTO tbl_item (Pawnticket_ID, Item_Value, Description, Interest, Net_Value, Category) 
                                 VALUES (?, ?, ?, ?, ?, ?)");
    $stmt_item->bind_param("idssds", $pawnticket_id, $item_value, $description, $interest, $net_value, $category);
    $stmt_item->execute();
    $item_id = $stmt_item->insert_id;

    // ✅ Commit the transaction
    $conn->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Pawn ticket and item added successfully',
        'pawnticket_id' => $pawnticket_id,
        'item_id' => $item_id
    ]);
} catch (Exception $e) {
    $conn->rollback(); // Rollback if any error occurs
    echo json_encode(['status' => 'error', 'message' => 'Transaction failed: ' . $e->getMessage()]);
}

$conn->close();
?>
