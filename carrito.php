

<?php
// procesar_compra.php

// Configuración de la base de datos
$host = 'localhost';
$db   = 'agkm';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Recibir datos del cliente y carrito
$datos = json_decode(file_get_contents('php://input'), true);

// Insertar datos del cliente
$stmt = $pdo->prepare("INSERT INTO clientes (nombre, apellido, telefono) VALUES (?, ?, ?)");
$stmt->execute([$datos['nombre'], $datos['apellido'], $datos['telefono']]);
$cliente_id = $pdo->lastInsertId();

// Insertar datos de la compra
foreach ($datos['carrito'] as $item) {
    $stmt = $pdo->prepare("INSERT INTO compras (cliente_id, producto_id, producto_nombre, cantidad, precio) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$cliente_id, $item['id'], $item['nombre'], $item['cantidad'], $item['precio']]);
}
// Responder al cliente
echo json_encode(['success' => true]);