<?php
$url = 'http://localhost:8000/data.php'; // Update the URL if necessary
$data = array('name' => 'John Doe', 'response' => 'Sample response');

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
    ),
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

if ($result === FALSE) {
    /* Handle error */
    echo "Error sending POST request.";
} else {
    echo $result;
}
?>