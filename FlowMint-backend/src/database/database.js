require('dotenv').config();

const { Pool } = require('pg');

// Configuración de la conexión a la base de datos PostgreSQL usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'FlowMint',
  password: process.env.DB_PASSWORD,
  port: 5432, // Puerto por defecto de PostgreSQL
});

// Probar la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la base de datos PostgreSQL:', err.stack);
  } else {
    console.log('Conexión exitosa a la base de datos PostgreSQL:', res.rows[0]);
  }
});

// Exportar la conexión para su uso en otros módulos
module.exports = pool;
