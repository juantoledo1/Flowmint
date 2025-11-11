const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const { verificarRol, esAdmin, esEmpleado } = require('../middleware/rolMiddleware');

// Utility function to handle errors
const handleError = (res, error) => {
    console.error('Database error:', error);
    res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
};

// Listar todos los turnos con detalles - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/listar_turnos:
 *   get:
 *     tags: [Turnos]
 *     summary: Listar todos los turnos
 *     description: Obtiene una lista de todos los turnos con detalles
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
 *         description: Lista de turnos
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_turno:
 *                 type: integer
 *               fecha:
 *                 type: string
 *               hora:
 *                 type: string
 *               nombre_cliente:
 *                 type: string
 *               apellido_cliente:
 *                 type: string
 *               nombre_servicio:
 *                 type: string
 *               precio:
 *                 type: number
 *               nombre_empleado:
 *                 type: string
 *               apellido_empleado:
 *                 type: string
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/listar_turnos', esEmpleado, (req, res) => {
    const query = `
        SELECT turnos.id_turno, turnos.fecha, turnos.hora, clientes.nombre AS nombre_cliente,
        clientes.apellido AS apellido_cliente, servicios.nombre AS nombre_servicio,
        servicios.precio, empleados.nombre AS nombre_empleado, empleados.apellido AS apellido_empleado
        FROM turnos
        INNER JOIN clientes ON turnos.id_cliente = clientes.id_cliente
        INNER JOIN servicios ON turnos.id_servicio = servicios.id_servicio
        INNER JOIN empleados ON turnos.id_empleado = empleados.id_empleado`;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Listar un turno por ID con detalles - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/listar_turno/{id}:
 *   get:
 *     tags: [Turnos]
 *     summary: Obtener un turno por ID
 *     description: Obtiene un turno específico por su ID con detalles
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del turno
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
 *         description: Turno encontrado
 *         schema:
 *           type: object
 *           properties:
 *             id_turno:
 *               type: integer
 *             fecha:
 *               type: string
 *             hora:
 *               type: string
 *             nombre_cliente:
 *               type: string
 *             apellido_cliente:
 *               type: string
 *             nombre_servicio:
 *               type: string
 *             precio:
 *               type: number
 *             nombre_empleado:
 *               type: string
 *             apellido_empleado:
 *               type: string
 *       403:
 *         description: Acceso no autorizado
 *       404:
 *         description: Turno no encontrado
 */
router.get('/listar_turno/:id', esEmpleado, (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT turnos.id_turno, turnos.fecha, turnos.hora, clientes.nombre AS nombre_cliente,
        clientes.apellido AS apellido_cliente, servicios.nombre AS nombre_servicio,
        empleados.nombre AS nombre_empleado, empleados.apellido AS apellido_empleado,
        servicios.precio
        FROM turnos
        INNER JOIN clientes ON turnos.id_cliente = clientes.id_cliente
        INNER JOIN servicios ON turnos.id_servicio = servicios.id_servicio
        INNER JOIN empleados ON turnos.id_empleado = empleados.id_empleado
        WHERE turnos.id_turno = $1`;
    pool.query(query, [id], (error, registros) => {
        if (error) return handleError(res, error);
        if (registros.rows.length > 0) {
            res.json(registros.rows);
        } else {
            res.json({ status: false, mensaje: "El ID del turno no existe" });
        }
    });
});

// Listar los turnos de un cliente por su ID - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/listar_turnos_cliente/{id_cliente}:
 *   get:
 *     tags: [Turnos]
 *     summary: Obtener turnos de un cliente
 *     description: Obtiene todos los turnos de un cliente específico
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id_cliente
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
 *         description: Lista de turnos del cliente
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id_turno:
 *                 type: integer
 *               fecha:
 *                 type: string
 *               hora:
 *                 type: string
 *               empleado_nombre:
 *                 type: string
 *               empleado_apellido:
 *                 type: string
 *               servicio_nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/listar_turnos_cliente/:id_cliente', esEmpleado, (req, res) => {
    const { id_cliente } = req.params;
    const query = `
        SELECT turnos.id_turno, turnos.fecha, turnos.hora, empleados.nombre AS empleado_nombre,
        empleados.apellido AS empleado_apellido, servicios.nombre AS servicio_nombre, servicios.precio
        FROM turnos
        INNER JOIN empleados ON turnos.id_empleado = empleados.id_empleado
        INNER JOIN servicios ON turnos.id_servicio = servicios.id_servicio
        WHERE turnos.id_cliente = $1`;
    pool.query(query, [id_cliente], (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Crear un nuevo turno - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/crear_turno:
 *   post:
 *     tags: [Turnos]
 *     summary: Crear un nuevo turno
 *     description: Crea un nuevo turno en el sistema
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: turnoData
 *         description: Datos del turno
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fecha:
 *               type: string
 *               example: "2023-12-25"
 *             hora:
 *               type: string
 *               example: "10:00:00"
 *             id_cliente:
 *               type: integer
 *               example: 1
 *             id_empleado:
 *               type: integer
 *               example: 1
 *             id_servicio:
 *               type: integer
 *               example: 1
 *     responses:
 *       200:
 *         description: Turno creado exitosamente
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
router.post('/crear_turno', esEmpleado, (req, res) => {
    const { fecha, hora, id_cliente, id_empleado, id_servicio } = req.body;
    const query = 'INSERT INTO turnos (fecha, hora, id_cliente, id_empleado, id_servicio) VALUES ($1, $2, $3, $4, $5)';
    pool.query(query, [fecha, hora, id_cliente, id_empleado, id_servicio], (error) => {
        if (error) return handleError(res, error);
        res.json({ status: true, mensaje: "El turno se creó correctamente" });
    });
});

// Actualizar un turno por ID - Solo para administradores
/**
 * @swagger
 * /turnos/actualizar_turno/{id}:
 *   put:
 *     tags: [Turnos]
 *     summary: Actualizar un turno
 *     description: Actualiza un turno específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del turno
 *         in: path
 *         required: true
 *         type: integer
 *       - name: turnoData
 *         description: Datos del turno
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fecha:
 *               type: string
 *               example: "2023-12-25"
 *             hora:
 *               type: string
 *               example: "10:00:00"
 *             id_cliente:
 *               type: integer
 *               example: 1
 *             id_empleado:
 *               type: integer
 *               example: 1
 *             id_servicio:
 *               type: integer
 *               example: 1
 *     responses:
 *       200:
 *         description: Turno actualizado exitosamente
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
 *         description: Turno no encontrado
 */
router.put('/actualizar_turno/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const { fecha, hora, id_cliente, id_empleado, id_servicio } = req.body;
    const query = 'UPDATE turnos SET fecha = $1, hora = $2, id_cliente = $3, id_empleado = $4, id_servicio = $5 WHERE id_turno = $6';
    pool.query(query, [fecha, hora, id_cliente, id_empleado, id_servicio, id], (error) => {
        if (error) return handleError(res, error);
        res.json({ status: true, mensaje: "El turno se actualizó correctamente" });
    });
});

// Eliminar un turno por ID - Solo para administradores
/**
 * @swagger
 * /turnos/eliminar_turno/{id}:
 *   delete:
 *     tags: [Turnos]
 *     summary: Eliminar un turno
 *     description: Elimina un turno específico por su ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: ID del turno
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
 *         description: Turno eliminado exitosamente
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
 *         description: Turno no encontrado
 */
router.delete('/eliminar_turno/:id', esAdmin, (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM turnos WHERE id_turno = $1';
    pool.query(query, [id], (error) => {
        if (error) return handleError(res, error);
        res.json({ status: true, mensaje: "El turno se eliminó correctamente" });
    });
});

// Ganancias Diarias - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_diarias:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias diarias
 *     description: Obtiene las ganancias del día actual
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
 *         description: Ganancias diarias
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               fecha:
 *                 type: string
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_diarias', esEmpleado, (req, res) => {
    const query = `
        SELECT DATE(t.fecha) AS fecha, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        WHERE t.fecha >= CURRENT_DATE AND t.fecha < CURRENT_DATE + INTERVAL '1 day'
        GROUP BY DATE(t.fecha)
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Ganancias Semanales - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_semanales:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias semanales
 *     description: Obtiene las ganancias de la semana actual
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
 *         description: Ganancias semanales
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               semana:
 *                 type: string
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_semanales', esEmpleado, (req, res) => {
    const query = `
        SELECT EXTRACT(WEEK FROM t.fecha) AS semana, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        WHERE t.fecha >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY EXTRACT(WEEK FROM t.fecha)
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Ganancias Mensuales - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_mensuales:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias mensuales
 *     description: Obtiene las ganancias del mes actual
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
 *         description: Ganancias mensuales
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               año:
 *                 type: integer
 *               mes:
 *                 type: integer
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_mensuales', esEmpleado, (req, res) => {
    const query = `
        SELECT EXTRACT(YEAR FROM t.fecha) AS año, EXTRACT(MONTH FROM t.fecha) AS mes, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        WHERE t.fecha >= DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY EXTRACT(YEAR FROM t.fecha), EXTRACT(MONTH FROM t.fecha)
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Ganancias Anuales - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_anuales:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias anuales
 *     description: Obtiene las ganancias de todos los años
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
 *         description: Ganancias anuales
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               año:
 *                 type: integer
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_anuales', esEmpleado, (req, res) => {
    const query = `
        SELECT EXTRACT(YEAR FROM t.fecha) AS año, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        GROUP BY EXTRACT(YEAR FROM t.fecha)
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Ganancias Mensuales por Servicio - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_mensuales_por_servicio:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias mensuales por servicio
 *     description: Obtiene las ganancias mensuales agrupadas por servicio
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
 *         description: Ganancias mensuales por servicio
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               año:
 *                 type: integer
 *               mes:
 *                 type: integer
 *               servicio:
 *                 type: string
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_mensuales_por_servicio', esEmpleado, (req, res) => {
    const query = `
        SELECT EXTRACT(YEAR FROM t.fecha) AS año, EXTRACT(MONTH FROM t.fecha) AS mes, s.nombre AS servicio, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        GROUP BY EXTRACT(YEAR FROM t.fecha), EXTRACT(MONTH FROM t.fecha), s.nombre
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Ganancias Mensuales por Empleado - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_mensuales_por_empleado:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias mensuales por empleado
 *     description: Obtiene las ganancias mensuales agrupadas por empleado
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
 *         description: Ganancias mensuales por empleado
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               año:
 *                 type: integer
 *               mes:
 *                 type: integer
 *               empleado:
 *                 type: string
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_mensuales_por_empleado', esEmpleado, (req, res) => {
    const query = `
        SELECT EXTRACT(YEAR FROM t.fecha) AS año, EXTRACT(MONTH FROM t.fecha) AS mes, e.nombre AS empleado, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        JOIN empleados e ON t.id_empleado = e.id_empleado
        GROUP BY EXTRACT(YEAR FROM t.fecha), EXTRACT(MONTH FROM t.fecha), e.nombre
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Ganancias Anuales por Servicio - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_anuales_por_servicio:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias anuales por servicio
 *     description: Obtiene las ganancias anuales agrupadas por servicio
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
 *         description: Ganancias anuales por servicio
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               año:
 *                 type: integer
 *               servicio:
 *                 type: string
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_anuales_por_servicio', esEmpleado, (req, res) => {
    const query = `
        SELECT EXTRACT(YEAR FROM t.fecha) AS año, s.nombre AS servicio, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        GROUP BY EXTRACT(YEAR FROM t.fecha), s.nombre
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

// Ganancias Anuales por Empleado - Permitido para usuarios autenticados
/**
 * @swagger
 * /turnos/ganancias_anuales_por_empleado:
 *   get:
 *     tags: [Turnos]
 *     summary: Ganancias anuales por empleado
 *     description: Obtiene las ganancias anuales agrupadas por empleado
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
 *         description: Ganancias anuales por empleado
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               año:
 *                 type: integer
 *               empleado:
 *                 type: string
 *               total:
 *                 type: number
 *       403:
 *         description: Acceso no autorizado
 */
router.get('/ganancias_anuales_por_empleado', esEmpleado, (req, res) => {
    const query = `
        SELECT EXTRACT(YEAR FROM t.fecha) AS año, e.nombre AS empleado, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        JOIN empleados e ON t.id_empleado = e.id_empleado
        GROUP BY EXTRACT(YEAR FROM t.fecha), e.nombre
    `;
    pool.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros.rows);
    });
});

module.exports = router;