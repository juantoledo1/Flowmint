const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const jwt = require('jsonwebtoken');
const { verificarRol, esAdmin, esEmpleado } = require('../middleware/rolMiddleware');

// Listar todos los empleados - Permitido para usuarios autenticados
/**
 * @swagger
 * /empleados/listar_empleados:
 *   get:
 *     tags: [Empleados]
 *     summary: Listar todos los empleados
 *     description: Obtiene una lista de todos los empleados
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
 *         description: Lista de empleados
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_empleado:
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
router.get('/listar_empleados', esEmpleado, (req, res) => {
    const query = 'SELECT * FROM empleados';
    pool.query(query, (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(registros.rows);
        }
    });
});

// Listar un empleado por ID - Permitido para usuarios autenticados
/**
 * @swagger
 * /empleados/listar_empleado/{id}:
 *   get:
 *     tags: [Empleados]
 *     summary: Obtener un empleado por ID
 *     description: Obtiene un empleado específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del empleado
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
 *         description: Empleado encontrado
 *         schema:
 *           type: object
 *           properties:
 *             id_empleado:
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
 *         description: Empleado no encontrado
 */
router.get('/listar_empleado/:id', esEmpleado, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM empleados WHERE id_empleado = $1';
    pool.query(query, [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rows.length > 0) {
                res.json(registros.rows);
            } else {
                res.json({ status: false, mensaje: "El ID del empleado no existe" });
            }
        }
    });
});

// Crear un nuevo empleado - Solo para administradores
/**
 * @swagger
 * /empleados/crear_empleado:
 *   post:
 *     tags: [Empleados]
 *     summary: Crear un nuevo empleado
 *     description: Crea un nuevo empleado en el sistema
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: empleadoData
 *         description: Datos del empleado
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
 *             correo:
 *               type: string
 *               example: "juan@empresa.com"
 *             telefono:
 *               type: string
 *               example: "123456789"
 *     responses:
 *       200:
 *         description: Empleado creado exitosamente
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
router.post('/crear_empleado', esAdmin, (req, res) => {
    const { nombre, apellido, correo, telefono } = req.body;
    const query = 'INSERT INTO empleados (nombre, apellido, correo, telefono) VALUES ($1, $2, $3, $4)';
    pool.query(query, [nombre, apellido, correo, telefono], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json({ status: true, mensaje: "El empleado se creó correctamente" });
        }
    });
});

// Actualizar un empleado por ID - Solo para administradores
/**
 * @swagger
 * /empleados/actualizar_empleado/{id}:
 *   put:
 *     tags: [Empleados]
 *     summary: Actualizar un empleado
 *     description: Actualiza un empleado específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del empleado
 *         in: path
 *         required: true
 *         type: integer
 *       - name: empleadoData
 *         description: Datos del empleado
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
 *             correo:
 *               type: string
 *               example: "juan@empresa.com"
 *             telefono:
 *               type: string
 *               example: "123456789"
 *     responses:
 *       200:
 *         description: Empleado actualizado exitosamente
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
 *         description: Empleado no encontrado
 */
router.put('/actualizar_empleado/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono } = req.body;
    const query = 'UPDATE empleados SET nombre = $1, apellido = $2, correo = $3, telefono = $4 WHERE id_empleado = $5';
    pool.query(query, [nombre, apellido, correo, telefono, id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rowCount > 0) {
                res.json({ status: true, mensaje: "El empleado se actualizó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del empleado no existe" });
            }
        }
    });
});

// Eliminar un empleado por ID - Solo para administradores
/**
 * @swagger
 * /empleados/eliminar_empleado/{id}:
 *   delete:
 *     tags: [Empleados]
 *     summary: Eliminar un empleado
 *     description: Elimina un empleado específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del empleado
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
 *         description: Empleado eliminado exitosamente
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
 *         description: Empleado no encontrado
 */
router.delete('/eliminar_empleado/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM empleados WHERE id_empleado = $1';
    pool.query(query, [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rowCount > 0) {
                res.json({ status: true, mensaje: "El empleado se eliminó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del empleado no existe" });
            }
        }
    });
});

module.exports = router;