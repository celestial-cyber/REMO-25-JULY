<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Only POST method allowed"]);
    exit;
}

include 'db.php';

$user_id = 1;

$sql = "DELETE FROM history WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "History cleared successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to delete history"]);
}

$stmt->close();
$conn->close();
?>
