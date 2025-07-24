<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");
require 'database.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['pawnticket_id'], $data['new_principal'], $data['maturity_date'], $data['expiration_date'], $data['penalty'], $data['date_paid'], $data['amount_paid'], $data['payment_type'])) {

    $pawnticket_id = $data['pawnticket_id'];
    $new_principal = $data['new_principal'];
    $maturity_date = $data['maturity_date'];
    $expiration_date = $data['expiration_date'];
    $penalty = $data['penalty'];
    $date_paid = $data['date_paid'];
    $amount_paid = $data['amount_paid'];
    $payment_type = $data['payment_type'];

    $conn->begin_transaction();

    try {
        function resetAutoIncrement($conn, $table) {
            $result = $conn->query("SELECT COUNT(*) AS count FROM $table");
            $row = $result->fetch_assoc();
            if ($row['count'] == 0) {
                $conn->query("ALTER TABLE $table AUTO_INCREMENT = 1");
            }
        }

        resetAutoIncrement($conn, "tbl_payment");
        resetAutoIncrement($conn, "tbl_renew");

        // ✅ Get Customer_ID and Item_ID from Old Pawn Ticket
        $stmt = $conn->prepare("SELECT Customer_ID FROM tbl_pawnticket WHERE Pawnticket_ID = ?");
        $stmt->bind_param("i", $pawnticket_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $pawnticket = $result->fetch_assoc();

        if (!$pawnticket) {
            throw new Exception("❌ Pawn Ticket not found!");
        }

        $customer_id = $pawnticket['Customer_ID'];

        $stmt = $conn->prepare("SELECT Item_ID FROM tbl_item WHERE Pawnticket_ID = ?");
        $stmt->bind_param("i", $pawnticket_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $item = $result->fetch_assoc();

        if (!$item) {
            throw new Exception("❌ Item not found for the old Pawn Ticket!");
        }

        $item_id = $item['Item_ID'];

        // ✅ Step 1: Create a NEW Pawn Ticket
        $stmt = $conn->prepare("INSERT INTO tbl_pawnticket (Customer_ID, Principal_Value, Maturity_Date, Expiry_Date) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("idss", $customer_id, $new_principal, $maturity_date, $expiration_date);
        $stmt->execute();
        $new_pawnticket_id = $stmt->insert_id;

        // ✅ Step 2: Link Item_ID to the New Pawn Ticket in tbl_renewed_items
        $stmt = $conn->prepare("INSERT INTO tbl_renewed_items (Pawnticket_ID, Item_ID) VALUES (?, ?)");
        $stmt->bind_param("ii", $new_pawnticket_id, $item_id);
        $stmt->execute();

        // ✅ Step 3: Insert into tbl_payment USING THE NEW PAWNTICKET_ID
        $stmt = $conn->prepare("INSERT INTO tbl_payment (Pawnticket_ID, Date_Paid, Amount_Paid, PaymentType) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $new_pawnticket_id, $date_paid, $amount_paid, $payment_type);
        $stmt->execute();
        $payment_id = $stmt->insert_id;

        // ✅ Step 4: Insert into tbl_renew USING THE NEW PAYMENT_ID
        $stmt = $conn->prepare("INSERT INTO tbl_renew (Payment_ID, New_Principal_Value, Maturity_Date, Expiration_Date, Penalty) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("idssd", $payment_id, $new_principal, $maturity_date, $expiration_date, $penalty);
        $stmt->execute();

        $conn->commit();
        echo json_encode(["status" => "success", "new_pawnticket_id" => $new_pawnticket_id]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request data"]);
}
?>
