const express = require('express');
const router = express.Router();
const mysqlConnect = require('../database/database');
const jwt = require('jsonwebtoken');

// Verificar token JWT
function verificarToken(req, res, next) {
    const bearer = req.headers['authorization'];
    if (typeof bearer !== 'undefined') {
        const token = bearer.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
            if (error) {
                res.status(403).json({ status: false, mensaje: "Token inválido" });
            } else {
                req.token = token;
                req.usuarioId = decoded.id;
                next();
            }
        });
    } else {
        res.status(403).json({ status: false, mensaje: "No hay token de autorización" });
    }
}

// Verificar rol - función auxiliar para obtener el rol del usuario
function obtenerRolUsuario(usuarioId, callback) {
    mysqlConnect.query(
        'SELECT rol_id FROM usuarios WHERE usuario_id = ?', 
        [usuarioId], 
        (error, resultados) => {
            if (error) {
                callback(error, null);
            } else if (resultados.length === 0) {
                callback(new Error("Usuario no encontrado"), null);
            } else {
                callback(null, resultados[0].rol_id);
            }
        }
    );
}

// Middleware para verificar rol
function verificarRol(rolesPermitidos) {
    return (req, res, next) => {
        if (!req.usuarioId) {
            return res.status(403).json({ status: false, mensaje: "No autenticado" });
        }

        obtenerRolUsuario(req.usuarioId, (error, rolUsuario) => {
            if (error) {
                console.log('Error al verificar rol del usuario:', error);
                return res.status(500).json({ status: false, mensaje: "Error al verificar rol del usuario" });
            }

            if (rolesPermitidos.includes(rolUsuario)) {
                req.rolUsuario = rolUsuario;
                next();
            } else {
                res.status(403).json({ status: false, mensaje: "No tienes permiso para realizar esta acción" });
            }
        });
    };
}

// Middleware específico para usuarios con rol de administrador (rol_id = 1)
const esAdmin = verificarRol([1]);

// Middleware para usuarios con rol de empleado o administrador (rol_id = 1 o 2)
const esEmpleado = verificarRol([1, 2]);

// Utility function to handle errors
const handleError = (res, error) => {
    console.error('Database error:', error);
    res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
};

// Listar todos los turnos con detalles - Permitido para usuarios autenticados
router.get('/listar_turnos', verificarToken, esEmpleado, (req, res) => {
    mysqlConnect.query(
        `SELECT turnos.id_turno, turnos.fecha, turnos.hora, clientes.nombre AS nombre_cliente, 
        clientes.apellido AS apellido_cliente, servicios.nombre AS nombre_servicio, 
        servicios.precio, empleados.nombre AS nombre_empleado, empleados.apellido AS apellido_empleado 
        FROM turnos 
        INNER JOIN clientes ON turnos.id_cliente = clientes.id_cliente 
        INNER JOIN servicios ON turnos.id_servicio = servicios.id_servicio 
        INNER JOIN empleados ON turnos.id_empleado = empleados.id_empleado`,
        (error, registros) => {
            if (error) return handleError(res, error);
            res.json(registros);
        }
    );
});

// Listar un turno por ID con detalles - Permitido para usuarios autenticados
router.get('/listar_turno/:id', verificarToken, esEmpleado, (req, res) => {
    const { id } = req.params;
    mysqlConnect.query(
        `SELECT turnos.id_turno, turnos.fecha, turnos.hora, clientes.nombre AS nombre_cliente, 
        clientes.apellido AS apellido_cliente, servicios.nombre AS nombre_servicio, 
        empleados.nombre AS nombre_empleado, empleados.apellido AS apellido_empleado, 
        servicios.precio 
        FROM turnos 
        INNER JOIN clientes ON turnos.id_cliente = clientes.id_cliente 
        INNER JOIN servicios ON turnos.id_servicio = servicios.id_servicio 
        INNER JOIN empleados ON turnos.id_empleado = empleados.id_empleado 
        WHERE turnos.id_turno = ?`, [id],
        (error, registros) => {
            if (error) return handleError(res, error);
            if (registros.length > 0) {
                res.json(registros);
            } else {
                res.json({ status: false, mensaje: "El ID del turno no existe" });
            }
        }
    );
});

// Listar los turnos de un cliente por su ID - Permitido para usuarios autenticados
router.get('/listar_turnos_cliente/:id_cliente', verificarToken, esEmpleado, (req, res) => {
    const { id_cliente } = req.params;
    mysqlConnect.query(
        `SELECT turnos.id_turno, turnos.fecha, turnos.hora, empleados.nombre AS empleado_nombre, 
        empleados.apellido AS empleado_apellido, servicios.nombre AS servicio_nombre, servicios.precio 
        FROM turnos 
        INNER JOIN empleados ON turnos.id_empleado = empleados.id_empleado 
        INNER JOIN servicios ON turnos.id_servicio = servicios.id_servicio 
        WHERE turnos.id_cliente = ?`, [id_cliente],
        (error, registros) => {
            if (error) return handleError(res, error);
            res.json(registros);
        }
    );
});

// Crear un nuevo turno - Permitido para usuarios autenticados
router.post('/crear_turno', verificarToken, esEmpleado, (req, res) => {
    const { fecha, hora, id_cliente, id_empleado, id_servicio } = req.body;
    mysqlConnect.query(
        'INSERT INTO turnos (fecha, hora, id_cliente, id_empleado, id_servicio) VALUES (?, ?, ?, ?, ?)', 
        [fecha, hora, id_cliente, id_empleado, id_servicio],
        (error) => {
            if (error) return handleError(res, error);
            res.json({ status: true, mensaje: "El turno se creó correctamente" });
        }
    );
});

// Actualizar un turno por ID - Solo para administradores
router.put('/actualizar_turno/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    const { fecha, hora, id_cliente, id_empleado, id_servicio } = req.body;
    mysqlConnect.query(
        'UPDATE turnos SET fecha = ?, hora = ?, id_cliente = ?, id_empleado = ?, id_servicio = ? WHERE id_turno = ?', 
        [fecha, hora, id_cliente, id_empleado, id_servicio, id],
        (error) => {
            if (error) return handleError(res, error);
            res.json({ status: true, mensaje: "El turno se actualizó correctamente" });
        }
    );
});

// Eliminar un turno por ID - Solo para administradores
router.delete('/eliminar_turno/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    mysqlConnect.query(
        'DELETE FROM turnos WHERE id_turno = ?', [id],
        (error) => {
            if (error) return handleError(res, error);
            res.json({ status: true, mensaje: "El turno se eliminó correctamente" });
        }
    );
});

// Ganancias Diarias - Permitido para usuarios autenticados
router.get('/ganancias_diarias', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT DATE(t.fecha) AS fecha, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        WHERE t.fecha >= CURDATE() AND t.fecha < CURDATE() + INTERVAL 1 DAY
        GROUP BY DATE(t.fecha)
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

// Ganancias Semanales - Permitido para usuarios autenticados
router.get('/ganancias_semanales', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT YEARWEEK(t.fecha, 1) AS semana, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        WHERE t.fecha >= CURDATE() - INTERVAL (WEEKDAY(CURDATE()) + 7) DAY
        GROUP BY YEARWEEK(t.fecha, 1)
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

// Ganancias Mensuales - Permitido para usuarios autenticados
router.get('/ganancias_mensuales', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT YEAR(t.fecha) AS año, MONTH(t.fecha) AS mes, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        WHERE t.fecha >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
        GROUP BY YEAR(t.fecha), MONTH(t.fecha)
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

// Ganancias Anuales - Permitido para usuarios autenticados
router.get('/ganancias_anuales', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT YEAR(t.fecha) AS año, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        GROUP BY YEAR(t.fecha)
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

// Ganancias Mensuales por Servicio - Permitido para usuarios autenticados
router.get('/ganancias_mensuales_por_servicio', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT YEAR(t.fecha) AS año, MONTH(t.fecha) AS mes, s.nombre AS servicio, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        GROUP BY YEAR(t.fecha), MONTH(t.fecha), s.nombre
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

// Ganancias Mensuales por Empleado - Permitido para usuarios autenticados
router.get('/ganancias_mensuales_por_empleado', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT YEAR(t.fecha) AS año, MONTH(t.fecha) AS mes, e.nombre AS empleado, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        JOIN empleados e ON t.id_empleado = e.id_empleado
        GROUP BY YEAR(t.fecha), MONTH(t.fecha), e.nombre
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

// Ganancias Anuales por Servicio - Permitido para usuarios autenticados
router.get('/ganancias_anuales_por_servicio', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT YEAR(t.fecha) AS año, s.nombre AS servicio, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        GROUP BY YEAR(t.fecha), s.nombre
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

// Ganancias Anuales por Empleado - Permitido para usuarios autenticados
router.get('/ganancias_anuales_por_empleado', verificarToken, esEmpleado, (req, res) => {
    const query = `
        SELECT YEAR(t.fecha) AS año, e.nombre AS empleado, SUM(s.precio) AS total
        FROM turnos t
        JOIN servicios s ON t.id_servicio = s.id_servicio
        JOIN empleados e ON t.id_empleado = e.id_empleado
        GROUP BY YEAR(t.fecha), e.nombre
    `;
    mysqlConnect.query(query, (error, registros) => {
        if (error) return handleError(res, error);
        res.json(registros);
    });
});

module.exports = router;
