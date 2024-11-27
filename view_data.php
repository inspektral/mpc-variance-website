<?php
try {
    $db = new PDO('sqlite:database.db');
    $stmt = $db->query("SELECT * FROM responses");
    $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<pre>";
    print_r($responses);
    echo "</pre>";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>