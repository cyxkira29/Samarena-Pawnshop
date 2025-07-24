<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'database.php';

$sql = "
    SELECT 
        (SELECT COUNT(*) FROM tbl_item) AS total_pawned,
        (SELECT COUNT(*) FROM tbl_auctioned_items) AS total_auctioned,
        (SELECT COUNT(*) FROM tbl_sold_items) AS total_sold
";

$result = $conn->query($sql);

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(["total_pawned" => 0, "total_auctioned" => 0, "total_sold" => 0]);
}

$conn->close();
?>
