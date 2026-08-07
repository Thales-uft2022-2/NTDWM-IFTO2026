<?php
$host = 'localhost';
$db   = 'sistema_academico_monolitico';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    die(
        "<h2>Erro de conexão com o banco de dados.</h2>" .
        "<p>Crie o banco <strong>sistema_academico_monolitico</strong> no phpMyAdmin " .
        "e importe o arquivo <strong>banco.sql</strong>.</p>" .
        "<p>Detalhes: " . htmlspecialchars($e->getMessage()) . "</p>"
    );
}
?>