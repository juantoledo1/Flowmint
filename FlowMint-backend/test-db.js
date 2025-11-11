const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432, // Puerto estándar de PostgreSQL
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'FlowMint'
});

async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Conexión a la base de datos exitosa:', result.rows[0]);
    
    // Verificar si la tabla de usuarios existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    console.log('Tabla usuarios existe:', tableCheck.rows[0].exists);
    
    // Si no existe, crearla
    if (!tableCheck.rows[0].exists) {
      console.log('Creando tabla usuarios...');
      await pool.query(`
        CREATE TABLE usuarios (
          usuario_id SERIAL PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL,
          apellido VARCHAR(255) NOT NULL,
          dni VARCHAR(20),
          "user" VARCHAR(255) UNIQUE NOT NULL,
          pass VARCHAR(255) NOT NULL,
          correo VARCHAR(255),
          rol_id INTEGER DEFAULT 2,
          estado VARCHAR(1) DEFAULT 'A'
        );
      `);
      console.log('Tabla usuarios creada');
    }
    
    // Verificar si la tabla roles existe
    const rolesTableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'roles'
      );
    `);
    
    console.log('Tabla roles existe:', rolesTableCheck.rows[0].exists);
    
    // Si no existe, crearla
    if (!rolesTableCheck.rows[0].exists) {
      console.log('Creando tabla roles...');
      await pool.query(`
        CREATE TABLE roles (
          rol_id SERIAL PRIMARY KEY,
          nombre VARCHAR(255) NOT NULL
        );
      `);
      
      // Insertar roles predeterminados
      await pool.query("INSERT INTO roles (nombre) VALUES ('admin'), ('empleado') ON CONFLICT DO NOTHING;");
      console.log('Tabla roles creada y roles predeterminados insertados');
    }
    
    // Verificar si existen usuarios
    const usuarios = await pool.query('SELECT * FROM usuarios LIMIT 5;');
    console.log('Usuarios encontrados:', usuarios.rows.length);
    
    // Cerrar la conexión
    await pool.end();
    console.log('Conexión cerrada');
  } catch (error) {
    console.error('Error en la conexión a la base de datos:', error);
    await pool.end();
  }
}

testConnection();