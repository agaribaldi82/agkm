<?php

$conex = mysqli_connect("localhost", "u540045792_agaribaldi", "Bruno2906-", "u540045792_socios");
// Configuración de la base de datos
$host = 'localhost';
$db   = 'u540045792_socios';
$user = 'u540045792_agaribaldi';
$pass = 'Bruno2906-';
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

// Manejar la solicitud POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit;
    }

    // Extraer los datos del pedido
    $nombre = $data['nombre'] ?? '';
    $apellido = $data['apellido'] ?? '';
    $telefono = $data['telefono'] ?? '';
    $email = $data['email'] ?? '';
    $productosCarrito = $data['productosCarrito'] ?? [];
    $nuevoTotal = $data['nuevoTotal'] ?? 0;

    // Preparar la consulta SQL
    $sql = "INSERT INTO pedidos (nombre, apellido, telefono, email, productos, total) VALUES (?, ?, ?, ?, ?, ?)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $nombre,
            $apellido,
            $telefono,
            $email,
            json_encode($productosCarrito),
            $nuevoTotal
        ]);

        http_response_code(200);
        echo json_encode(['message' => 'Pedido guardado con éxito']);
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al procesar el pedido: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>