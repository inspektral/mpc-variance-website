<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data) {
        $file = 'responses.json';
        $responses = [];

        if (file_exists($file)) {
            $responses = json_decode(file_get_contents($file), true);
        }

        $responses[] = $data;

        file_put_contents($file, json_encode($responses, JSON_PRETTY_PRINT));
        echo "Data saved successfully.";
    } else {
        echo "Invalid data received: " . $input;
    }
} else {
    echo "Invalid request method.";
}
?>
