const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { verificarRol, esAdmin, esEmpleado } = require('../middleware/rolMiddleware');

const prisma = new PrismaClient();

// Listar usuarios
/**
 * @swagger
 * /usuarios/listar_usuarios:
 *   get:
 *     tags: [Usuarios]
 *     summary: Listar todos los usuarios
 *     description: Obtiene una lista de todos los usuarios registrados
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         description: Token JWT de autorización
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               dni:
 *                 type: string
 *               user:
 *                 type: string
 *               correo:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *               estado:
 *                 type: string
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/listar_usuarios', esEmpleado, (req, res) => {
  const query = 'SELECT usuario_id, nombre, apellido, dni, "user", correo, rol_id, estado FROM usuarios';
  mysqlConnect.query(query, (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      res.json(registros.rows);
    }
  });
});

// Obtener un usuario por ID
/**
 * @swagger
 * /usuarios/obtener_usuario/{id_usuario}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Obtener un usuario por ID
 *     description: Obtiene un usuario específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_usuario
 *         description: ID del usuario
 *         in: path
 *         required: true
 *         type: integer
 *       - name: Authorization
 *         in: header
 *         description: Token JWT de autorización
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         schema:
 *           type: object
 *           properties:
 *             usuario_id:
 *               type: integer
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             dni:
 *               type: string
 *             user:
 *               type: string
 *             correo:
 *               type: string
 *             rol_id:
 *               type: integer
 *             estado:
 *               type: string
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/obtener_usuario/:id_usuario', esEmpleado, (req, res) => {
  const { id_usuario } = req.params;
  const query = 'SELECT usuario_id, nombre, apellido, dni, "user", correo, rol_id, estado FROM usuarios WHERE usuario_id = $1';
  mysqlConnect.query(query, [id_usuario], (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      if (registros.rows.length > 0) {
        res.json(registros.rows[0]);
      } else {
        res.status(404).json({ status: false, mensaje: "El ID del usuario no existe" });
      }
    }
  });
});

// Crear un nuevo usuario
/**
 * @swagger
 * /usuarios/crear_usuario:
 *   post:
 *     tags: [Usuarios]
 *     summary: Crear un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userData
 *         description: Datos del usuario
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "Juan"
 *             apellido:
 *               type: string
 *               example: "Pérez"
 *             dni:
 *               type: string
 *               example: "12345678"
 *             user:
 *               type: string
 *               example: "juan.perez"
 *             pass:
 *               type: string
 *               example: "contraseña123"
 *             correo:
 *               type: string
 *               example: "juan@example.com"
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *             mensaje:
 *               type: string
 *       400:
 *         description: Campos requeridos faltantes
 */
router.post('/crear_usuario', (req, res) => {
  const { nombre, apellido, dni, user, pass, correo } = req.body;
  // Hash de la contraseña antes de almacenarla en la base de datos
  const hashedPassword = bcrypt.hashSync(pass, 10);

  // Verificar que los campos requeridos estén presentes
  if (!nombre || !apellido || !user || !pass) {
    return res.status(400).json({
      status: false,
      mensaje: "Los campos nombre, apellido, user y pass son requeridos"
    });
  }

  // Verificar si ya existe un usuario con el mismo nombre de usuario
  const checkUserQuery = 'SELECT COUNT(*) FROM usuarios WHERE user = $1';
  pool.query(checkUserQuery, [user], (error, results) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else if (parseInt(results.rows[0].count) > 0) {
      res.status(400).json({ status: false, mensaje: "El nombre de usuario ya existe" });
    } else {
      // Verificar si es el primer usuario para asignar rol de administrador
      const countQuery = 'SELECT COUNT(*) FROM usuarios';
      pool.query(countQuery, (error, results) => {
        if (error) {
          console.log('Error en la base de datos', error);
          res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
          const rol_id = parseInt(results.rows[0].count) === 0 ? 1 : 2; // El primer usuario es admin
          const insertQuery = 'INSERT INTO usuarios (nombre, apellido, dni, user, pass, correo, rol_id, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
          pool.query(insertQuery, [nombre, apellido, dni || null, user, hashedPassword, correo || null, rol_id, 'A'], (error, resultados) => {
            if (error) {
              console.log('Error en la base de datos', error);
              res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
            } else {
              res.json({ status: true, mensaje: "El usuario se creó correctamente" });
            }
          });
        }
      });
    }
  });
});

// Actualizar un usuario por ID
/**
 * @swagger
 * /usuarios/actualizar_usuario/{id_usuario}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Actualizar un usuario
 *     description: Actualiza un usuario específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_usuario
 *         description: ID del usuario
 *         in: path
 *         required: true
 *         type: integer
 *       - name: userData
 *         description: Datos del usuario
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "Juan"
 *             apellido:
 *               type: string
 *               example: "Pérez"
 *             dni:
 *               type: string
 *               example: "12345678"
 *             user:
 *               type: string
 *               example: "juan.perez"
 *             pass:
 *               type: string
 *               example: "nueva_contraseña123"
 *             correo:
 *               type: string
 *               example: "juan@example.com"
 *             rol_id:
 *               type: integer
 *               example: 2
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *             mensaje:
 *               type: string
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/actualizar_usuario/:id_usuario', esAdmin, (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, apellido, dni, user, correo, rol_id } = req.body;
  const { pass } = req.body;

  let query;
  let queryParams;

  if (pass) {
    const hashedPassword = bcrypt.hashSync(pass, 10);
    query = 'UPDATE usuarios SET nombre = $1, apellido = $2, dni = $3, user = $4, pass = $5, correo = $6, rol_id = $7 WHERE usuario_id = $8';
    queryParams = [nombre, apellido, dni, user, hashedPassword, correo, rol_id, id_usuario];
  } else {
    query = 'UPDATE usuarios SET nombre = $1, apellido = $2, dni = $3, user = $4, correo = $5, rol_id = $6 WHERE usuario_id = $7';
    queryParams = [nombre, apellido, dni, user, correo, rol_id, id_usuario];
  }

  pool.query(query, queryParams, (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      if (registros.rowCount > 0) {
        res.json({ status: true, mensaje: "El usuario se actualizó correctamente" });
      } else {
        res.json({ status: false, mensaje: "El ID del usuario no existe" });
      }
    }
  });
});

// Eliminar un usuario por ID
/**
 * @swagger
 * /usuarios/eliminar_usuario/{id_usuario}:
 *   delete:
 *     tags: [Usuarios]
 *     summary: Eliminar un usuario
 *     description: Elimina un usuario específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_usuario
 *         description: ID del usuario
 *         in: path
 *         required: true
 *         type: integer
 *       - name: Authorization
 *         in: header
 *         description: Token JWT de autorización
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *             mensaje:
 *               type: string
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/eliminar_usuario/:id_usuario', esAdmin, (req, res) => {
  const { id_usuario } = req.params;
  const query = 'DELETE FROM usuarios WHERE usuario_id = $1';
  pool.query(query, [id_usuario], (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      if (registros.rowCount > 0) {
        res.json({ status: true, mensaje: "El usuario se eliminó correctamente" });
      } else {
        res.json({ status: false, mensaje: "El ID del usuario no existe" });
      }
    }
  });
});

module.exports = router;