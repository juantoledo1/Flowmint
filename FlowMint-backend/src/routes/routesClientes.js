const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const { verificarRol, esAdmin, esEmpleado } = require('../middleware/rolMiddleware');

// Listar todos los clientes - Permitido para usuarios autenticados
/**
 * @swagger
 * /clientes/listar_clientes:
 *   get:
 *     tags: [Clientes]
 *     summary: Listar todos los clientes
 *     description: Obtiene una lista de todos los clientes
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
 *         description: Lista de clientes
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_cliente:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/listar_clientes', esEmpleado, (req, res) => {
    const query = 'SELECT * FROM clientes';
    pool.query(query, (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(registros.rows);
        }
    });
});

// Listar un cliente por ID - Permitido para usuarios autenticados
/**
 * @swagger
 * /clientes/listar_cliente/{id}:
 *   get:
 *     tags: [Clientes]
 *     summary: Obtener un cliente por ID
 *     description: Obtiene un cliente específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del cliente
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
 *         description: Cliente encontrado
 *         schema:
 *           type: object
 *           properties:
 *             id_cliente:
 *               type: integer
 *             nombre:
 *               type: string
 *             apellido:
 *               type: string
 *             correo:
 *               type: string
 *             telefono:
 *               type: string
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/listar_cliente/:id', esEmpleado, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM clientes WHERE id_cliente = $1';
    pool.query(query, [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rows.length > 0) {
                res.json(registros.rows);
            } else {
                res.json({ status: false, mensaje: "El ID del cliente no existe" });
            }
        }
    });
});

// Crear un nuevo cliente - Permitido para usuarios autenticados
/**
 * @swagger
 * /clientes/crear_cliente:
 *   post:
 *     tags: [Clientes]
 *     summary: Crear un nuevo cliente
 *     description: Crea un nuevo cliente en el sistema
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: clienteData
 *         description: Datos del cliente
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "María"
 *             apellido:
 *               type: string
 *               example: "González"
 *             correo:
 *               type: string
 *               example: "maria@cliente.com"
 *             telefono:
 *               type: string
 *               example: "987654321"
 *     responses:
 *       200:
 *         description: Cliente creado exitosamente
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *             mensaje:
 *               type: string
 *       403:
 *         description: Acceso no autorizado
 */
router.post('/crear_cliente', esEmpleado, (req, res) => {
    const { nombre, apellido, correo, telefono } = req.body;
    const query = 'INSERT INTO clientes (nombre, apellido, correo, telefono) VALUES ($1, $2, $3, $4)';
    pool.query(query, [nombre, apellido, correo, telefono], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json({ status: true, mensaje: "El cliente se creó correctamente" });
        }
    });
});

// Actualizar un cliente por ID - Solo para administradores
/**
 * @swagger
 * /clientes/actualizar_cliente/{id}:
 *   put:
 *     tags: [Clientes]
 *     summary: Actualizar un cliente
 *     description: Actualiza un cliente específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del cliente
 *         in: path
 *         required: true
 *         type: integer
 *       - name: clienteData
 *         description: Datos del cliente
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "María"
 *             apellido:
 *               type: string
 *               example: "González"
 *             correo:
 *               type: string
 *               example: "maria@cliente.com"
 *             telefono:
 *               type: string
 *               example: "987654321"
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
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
 *         description: Cliente no encontrado
 */
router.put('/actualizar_cliente/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono } = req.body;
    const query = 'UPDATE clientes SET nombre = $1, apellido = $2, correo = $3, telefono = $4 WHERE id_cliente = $5';
    pool.query(query, [nombre, apellido, correo, telefono, id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rowCount > 0) {
                res.json({ status: true, mensaje: "El cliente se actualizó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del cliente no existe" });
            }
        }
    });
});

// Eliminar un cliente por ID - Solo para administradores
/**
 * @swagger
 * /clientes/eliminar_cliente/{id}:
 *   delete:
 *     tags: [Clientes]
 *     summary: Eliminar un cliente
 *     description: Elimina un cliente específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del cliente
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
 *         description: Cliente eliminado exitosamente
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
 *         description: Cliente no encontrado
 */
router.delete('/eliminar_cliente/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id_cliente = $1';
    pool.query(query, [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rowCount > 0) {
                res.json({ status: true, mensaje: "El cliente se eliminó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del cliente no existe" });
            }
        }
    });
});

module.exports = router;