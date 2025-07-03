<?php
file_put_contents("debug_log.txt", "Submit.php was triggered\n", FILE_APPEND); // test log

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

file_put_contents("debug_log.txt", print_r($data, true), FILE_APPEND); // log actual data

$prompt = $data['prompt'] ?? '';
$response = $data['response'] ?? '';
$user_id = 1;

if (!empty($prompt) && !empty($response)) {
    $stmt = $conn->prepare("INSERT INTO history (user_id, prompt, response) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $prompt, $response);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Saved successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Prompt or response missing"]);
}

$conn->close();
?>
