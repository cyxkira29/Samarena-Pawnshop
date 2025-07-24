<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

include('database.php');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['Customer_ID']) || !isset($data['Status'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing parameters.']);
    exit;
}

$customerID = $data['Customer_ID'];
$status = ($data['Status'] === 'Active') ? 'Active' : 'Inactive';

try {
    $query = "UPDATE tbl_customer SET Status = ? WHERE Customer_ID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $status, $customerID);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Status updated successfully.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No changes made.']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?>
