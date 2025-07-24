<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'database.php';

$sql = "SELECT 
            s.Sold_ID, 
            s.Item_ID, 
            s.Sale_Price, 
            s.Sold_Date, 
            CONCAT(c.Customer_FirstName, ' ', c.Customer_LastName) AS Customer_Name
        FROM tbl_sold_items s
        JOIN tbl_customer c ON s.Customer_ID = c.Customer_ID";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $soldItems = [];
    while ($row = $result->fetch_assoc()) {
        $soldItems[] = $row;
    }
    echo json_encode($soldItems);
} else {
    echo json_encode([]);
}

$conn->close();
?>
