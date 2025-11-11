const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const { verificarRol, esAdmin, esEmpleado } = require('../middleware/rolMiddleware');

// Obtener todos los roles - Solo para administradores
/**
 * @swagger
 * /roles/listar_roles:
 *   get:
 *     tags: [Roles]
 *     summary: Listar todos los roles
 *     description: Obtiene una lista de todos los roles
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
 *         description: Lista de roles
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               rol_id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/listar_roles', esAdmin, (req, res) => {
    const query = 'SELECT * FROM roles';
    pool.query(query, (error, roles) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(roles.rows);
        }
    });
});

// Obtener un rol por ID - Solo para administradores
/**
 * @swagger
 * /roles/roles/{id_rol}:
 *   get:
 *     tags: [Roles]
 *     summary: Obtener un rol por ID
 *     description: Obtiene un rol específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_rol
 *         description: ID del rol
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
 *         description: Rol encontrado
 *         schema:
 *           type: object
 *           properties:
 *             rol_id:
 *               type: integer
 *             nombre:
 *               type: string
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/roles/:id_rol', esAdmin, (req, res) => {
    const { id_rol } = req.params;
    const query = 'SELECT * FROM roles WHERE rol_id = $1';
    pool.query(query, [id_rol], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(resultado.rows);
        }
    });
});

// Crear un nuevo rol - Solo para administradores
/**
 * @swagger
 * /roles/crear_rol:
 *   post:
 *     tags: [Roles]
 *     summary: Crear un nuevo rol
 *     description: Crea un nuevo rol en el sistema
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: rolData
 *         description: Datos del rol
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "Administrador"
 *     responses:
 *       200:
 *         description: Rol creado exitosamente
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *             mensaje:
 *               type: string
 *             nuevo_id:
 *               type: integer
 *       403:
 *         description: Acceso no autorizado
 */
router.post('/crear_rol', esAdmin, (req, res) => {
    const { nombre } = req.body;

    const query = 'INSERT INTO roles (nombre) VALUES ($1) RETURNING rol_id';
    pool.query(query, [nombre], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json({ 
                status: true, 
                mensaje: "El rol se creó correctamente", 
                nuevo_id: resultado.rows[0].rol_id 
            });
        }
    });
});

// Actualizar un rol por ID - Solo para administradores
/**
 * @swagger
 * /roles/actualizar_rol/{id_rol}:
 *   put:
 *     tags: [Roles]
 *     summary: Actualizar un rol
 *     description: Actualiza un rol específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_rol
 *         description: ID del rol
 *         in: path
 *         required: true
 *         type: integer
 *       - name: rolData
 *         description: Datos del rol
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *               example: "Administrador"
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
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
 *         description: Rol no encontrado
 */
router.put('/actualizar_rol/:id_rol', esAdmin, (req, res) => {
    const { id_rol } = req.params;
    const { nombre } = req.body;

    const query = 'UPDATE roles SET nombre = $1 WHERE rol_id = $2';
    pool.query(query, [nombre, id_rol], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (resultado.rowCount > 0) {
                res.json({ status: true, mensaje: "El rol se actualizó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del rol no existe" });
            }
        }
    });
});

// Eliminar un rol por ID - Solo para administradores
/**
 * @swagger
 * /roles/eliminar_rol/{id_rol}:
 *   delete:
 *     tags: [Roles]
 *     summary: Eliminar un rol
 *     description: Elimina un rol específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_rol
 *         description: ID del rol
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
 *         description: Rol eliminado exitosamente
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
 *         description: Rol no encontrado
 */
router.delete('/eliminar_rol/:id_rol', esAdmin, (req, res) => {
    const { id_rol } = req.params;
    const query = 'DELETE FROM roles WHERE rol_id = $1';
    pool.query(query, [id_rol], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (resultado.rowCount > 0) {
                res.json({ status: true, mensaje: "El rol se eliminó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del rol no existe" });
            }
        }
    });
});

module.exports = router;