<?php
$host = "localhost";
$user = "root";
$password = ""; // Default password in XAMPP
$database = "ai_content";

// Create connection
$conn = new mysqli($host, $user, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
