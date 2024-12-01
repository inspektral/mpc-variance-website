<?php
$response = file_get_contents('http://yourdomain.com/get_data.php');
$responses = json_decode($response, true);

echo "<pre>";
print_r($responses);
echo "</pre>";
?>