const express = require('express');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Configura la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agkm'
});

// Conecta a la base de datos
connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para recibir los datos del pedido
app.post('/api/pedidos', (req, res) => {
  const { nombre, apellido, telefono, email, productosCarrito, nuevoTotal } = req.body;

  // Inserta los datos del pedido en la base de datos
  const query = 'INSERT INTO indumentaria (nombre, apellido, telefono, email, productos, total) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [nombre, apellido, telefono, email, JSON.stringify(productosCarrito), nuevoTotal], (err, result) => {
    if (err) {
      console.error('Error al insertar el pedido:', err);
      res.status(500).json({ error: 'Error al procesar el pedido' });
    } else {
      res.status(200).json({ message: 'Pedido guardado con éxito' });
    }
  });
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

/*
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'u540045792_agaribaldi',
  password: 'Bruno2906-',
  database: 'u540045792_socios'
});

MYSQL
CREATE TABLE indumentaria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    producto_id INT,
    producto_nombre VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);
*/