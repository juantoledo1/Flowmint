const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const { verificarRol, esAdmin, esEmpleado } = require('../middleware/rolMiddleware');

// Listar todos los servicios - Permitido para usuarios autenticados
/**
 * @swagger
 * /servicios/listar_servicios:
 *   get:
 *     tags: [Servicios]
 *     summary: Listar todos los servicios
 *     description: Obtiene una lista de todos los servicios
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
 *         description: Lista de servicios
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_servicio:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/listar_servicios', esEmpleado, (req, res) => {
    const query = 'SELECT * FROM servicios';
    pool.query(query, (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(registros.rows);
        }
    });
});

// Listar un servicio por ID - Permitido para usuarios autenticados
/**
 * @swagger
 * /servicios/listar_servicio/{id}:
 *   get:
 *     tags: [Servicios]
 *     summary: Obtener un servicio por ID
 *     description: Obtiene un servicio específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del servicio
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
 *         description: Servicio encontrado
 *         schema:
 *           type: object
 *           properties:
 *             id_servicio:
 *               type: integer
 *             nombre:
 *               type: string
 *             descripcion:
 *               type: string
 *             precio:
 *               type: number
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/listar_servicio/:id', esEmpleado, (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM servicios WHERE id_servicio = $1';
    pool.query(query, [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rows.length > 0) {
                res.json(registros.rows);
            } else {
                res.json({ status: false, mensaje: "El ID del servicio no existe" });
            }
        }
    });
});

// Crear un nuevo servicio - Solo para administradores
/**
 * @swagger
 * /servicios/crear_servicio:
 *   post:
 *     tags: [Servicios]
 *     summary: Crear un nuevo servicio
 *     description: Crea un nuevo servicio en el sistema
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: servicioData
 *         description: Datos del servicio
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "Corte de Cabello"
 *             descripcion:
 *               type: string
 *               example: "Corte de cabello para caballero"
 *             precio:
 *               type: number
 *               example: 15.50
 *     responses:
 *       200:
 *         description: Servicio creado exitosamente
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
router.post('/crear_servicio', esAdmin, (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    const query = 'INSERT INTO servicios (nombre, descripcion, precio) VALUES ($1, $2, $3)';
    pool.query(query, [nombre, descripcion, precio], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json({ status: true, mensaje: "El servicio se creó correctamente" });
        }
    });
});

// Actualizar un servicio por ID - Solo para administradores
/**
 * @swagger
 * /servicios/actualizar_servicio/{id}:
 *   put:
 *     tags: [Servicios]
 *     summary: Actualizar un servicio
 *     description: Actualiza un servicio específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del servicio
 *         in: path
 *         required: true
 *         type: integer
 *       - name: servicioData
 *         description: Datos del servicio
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "Corte de Cabello"
 *             descripcion:
 *               type: string
 *               example: "Corte de cabello para caballero"
 *             precio:
 *               type: number
 *               example: 15.50
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
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
 *         description: Servicio no encontrado
 */
router.put('/actualizar_servicio/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;
    const query = 'UPDATE servicios SET nombre = $1, descripcion = $2, precio = $3 WHERE id_servicio = $4';
    pool.query(query, [nombre, descripcion, precio, id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rowCount > 0) {
                res.json({ status: true, mensaje: "El servicio se actualizó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del servicio no existe" });
            }
        }
    });
});

// Eliminar un servicio por ID - Solo para administradores
/**
 * @swagger
 * /servicios/eliminar_servicio/{id}:
 *   delete:
 *     tags: [Servicios]
 *     summary: Eliminar un servicio
 *     description: Elimina un servicio específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del servicio
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
 *         description: Servicio eliminado exitosamente
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
 *         description: Servicio no encontrado
 */
router.delete('/eliminar_servicio/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM servicios WHERE id_servicio = $1';
    pool.query(query, [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.rowCount > 0) {
                res.json({ status: true, mensaje: "El servicio se eliminó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del servicio no existe" });
            }
        }
    });
});

module.exports = router;