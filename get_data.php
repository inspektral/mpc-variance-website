<?php
header('Content-Type: application/json');

$file = 'responses.json';

if (file_exists($file)) {
    $responses = file_get_contents($file);
    echo $responses;
} else {
    echo json_encode([]);
}
?>