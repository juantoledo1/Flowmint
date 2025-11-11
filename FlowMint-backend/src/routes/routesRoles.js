const express = require('express');
const router = express.Router();
const mysqlConnect = require('../database/database');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

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

// Obtener todos los roles - Solo para administradores
router.get('/listar_roles', verificarToken, esAdmin, (req, res) => {
    mysqlConnect.query('SELECT * FROM roles', (error, roles) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(roles);
        }
    });
});

// Obtener un rol por ID - Solo para administradores
router.get('/roles/:id_rol', verificarToken, esAdmin, (req, res) => {
    const { id_rol } = req.params;
    mysqlConnect.query('SELECT * FROM roles WHERE rol_id = ?', [id_rol], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(resultado);
        }
    });
});

// Crear un nuevo rol - Solo para administradores
router.post('/crear_rol', verificarToken, esAdmin, bodyParser.json(), (req, res) => {
    const { nombre } = req.body;

    mysqlConnect.query('INSERT INTO roles (nombre) VALUES (?)', [nombre], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json({ status: true, mensaje: "El rol se creó correctamente", nuevo_id: resultado.insertId });
        }
    });
});

// Actualizar un rol por ID - Solo para administradores
router.put('/actualizar_rol/:id_rol', verificarToken, esAdmin, bodyParser.json(), (req, res) => {
    const { id_rol } = req.params;
    const { nombre } = req.body;

    mysqlConnect.query('UPDATE roles SET nombre = ? WHERE rol_id = ?', [nombre, id_rol], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (resultado.affectedRows > 0) {
                res.json({ status: true, mensaje: "El rol se actualizó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del rol no existe" });
            }
        }
    });
});

// Eliminar un rol por ID - Solo para administradores
router.delete('/eliminar_rol/:id_rol', verificarToken, esAdmin, (req, res) => {
    const { id_rol } = req.params;
    mysqlConnect.query('DELETE FROM roles WHERE rol_id = ?', [id_rol], (error, resultado) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (resultado.affectedRows > 0) {
                res.json({ status: true, mensaje: "El rol se eliminó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del rol no existe" });
            }
        }
    });
});

module.exports = router;
