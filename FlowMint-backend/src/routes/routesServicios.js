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

const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

router.use(express.json());

// Listar todos los servicios - Permitido para usuarios autenticados
router.get('/listar_servicios', verificarToken, esEmpleado, (req, res) => {
    mysqlConnect.query('SELECT * FROM servicios', (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json(registros);
        }
    });
});

// Listar un servicio por ID - Permitido para usuarios autenticados
router.get('/listar_servicio/:id', verificarToken, esEmpleado, (req, res) => {
    const { id } = req.params;
    mysqlConnect.query('SELECT * FROM servicios WHERE id_servicio = ?', [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.length > 0) {
                res.json(registros);
            } else {
                res.json({ status: false, mensaje: "El ID del servicio no existe" });
            }
        }
    });
});

// Crear un nuevo servicio - Solo para administradores
router.post('/crear_servicio', verificarToken, esAdmin, (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    mysqlConnect.query('INSERT INTO servicios (nombre, descripcion, precio) VALUES (?, ?, ?)', [nombre, descripcion, precio], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            res.json({ status: true, mensaje: "El servicio se creó correctamente" });
        }
    });
});

// Actualizar un servicio por ID - Solo para administradores
router.put('/actualizar_servicio/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;
    mysqlConnect.query('UPDATE servicios SET nombre = ?, descripcion = ?, precio = ? WHERE id_servicio = ?', [nombre, descripcion, precio, id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.affectedRows > 0) {
                res.json({ status: true, mensaje: "El servicio se actualizó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del servicio no existe" });
            }
        }
    });
});

// Eliminar un servicio por ID - Solo para administradores
router.delete('/eliminar_servicio/:id', verificarToken, esAdmin, (req, res) => {
    const { id } = req.params;
    mysqlConnect.query('DELETE FROM servicios WHERE id_servicio = ?', [id], (error, registros) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            if (registros.affectedRows > 0) {
                res.json({ status: true, mensaje: "El servicio se eliminó correctamente" });
            } else {
                res.json({ status: false, mensaje: "El ID del servicio no existe" });
            }
        }
    });
});

module.exports = router;
