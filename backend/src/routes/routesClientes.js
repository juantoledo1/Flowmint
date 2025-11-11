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

// Listar todos los clientes - Permitido para usuarios autenticados
router.get('/listar_clientes', verificarToken, esEmpleado, (req, res) => {
    mysqlConnect.query('SELECT * FROM clientes', (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(registros);
        }
    });
});

// Listar un cliente por ID - Permitido para usuarios autenticados
router.get('/listar_cliente/:id', verificarToken, esEmpleado, (req, res) => {
    const { id } = req.params;
    mysqlConnect.query('SELECT * FROM clientes WHERE id_cliente = ?', [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.length > 0) {
                res.json(registros);
            } else {
                res.json({ status: false, mensaje: "El ID del cliente no existe" });
            }
        }
    });
});

// Crear un nuevo cliente - Permitido para usuarios autenticados
router.post('/crear_cliente', verificarToken, esEmpleado, (req, res) => {
    const { nombre, apellido, correo, telefono } = req.body;
    mysqlConnect.query('INSERT INTO clientes (nombre, apellido, correo, telefono) VALUES (?, ?, ?, ?)', [nombre, apellido, correo, telefono], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json({ status: true, mensaje: "El cliente se creó correctamente" });
        }
    });
});

// Actualizar un cliente por ID - Solo para administradores
router.put('/actualizar_cliente/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, correo, telefono } = req.body;
    mysqlConnect.query('UPDATE clientes SET nombre = ?, apellido = ?, correo = ?, telefono = ? WHERE id_cliente = ?', [nombre, apellido, correo, telefono, id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.affectedRows > 0) {
                res.json({ status: true, mensaje: "El cliente se actualizó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del cliente no existe" });
            }
        }
    });
});

// Eliminar un cliente por ID - Solo para administradores
router.delete('/eliminar_cliente/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    mysqlConnect.query('DELETE FROM clientes WHERE id_cliente = ?', [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.affectedRows > 0) {
                res.json({ status: true, mensaje: "El cliente se eliminó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del cliente no existe" });
            }
        }
    });
});

module.exports = router;
