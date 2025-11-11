require('dotenv').config();

const mysql = require('mysql2');

// Configuración de la conexión a la base de datos usando variables de entorno
const mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'peluqueria',
});

// Conectar a la base de datos
mysqlConnection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Exportar la conexión para su uso en otros módulos
module.exports = mysqlConnection;
