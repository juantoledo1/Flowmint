require('dotenv').config();

const jwt = require('jsonwebtoken');
const mysqlConnect = require('../database/database');

// Middleware para verificar el rol del usuario
const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const bearer = req.headers['authorization'];
        if (typeof bearer === 'undefined') {
            return res.status(403).json({ status: false, mensaje: "No hay token de autorización" });
        }

        const token = bearer.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET || 'cortandoando', (error, decoded) => {
            if (error) {
                return res.status(403).json({ status: false, mensaje: "Token inválido" });
            }

            // Obtener información del usuario desde la base de datos para verificar el rol
            mysqlConnect.query(
                'SELECT rol_id FROM usuarios WHERE usuario_id = ?', 
                [decoded.id], 
                (error, resultados) => {
                    if (error) {
                        console.log('Error al verificar rol del usuario', error);
                        return res.status(500).json({ status: false, mensaje: "Error al verificar rol del usuario" });
                    }

                    if (resultados.length === 0) {
                        return res.status(403).json({ status: false, mensaje: "Usuario no encontrado" });
                    }

                    const rolUsuario = resultados[0].rol_id;

                    // Verificar si el rol del usuario está en la lista de roles permitidos
                    if (rolesPermitidos.includes(rolUsuario)) {
                        req.usuarioId = decoded.id;
                        req.rolUsuario = rolUsuario;
                        next();
                    } else {
                        res.status(403).json({ status: false, mensaje: "No tienes permiso para realizar esta acción" });
                    }
                }
            );
        });
    };
};

// Middleware específico para usuarios con rol de administrador (rol_id = 1)
const esAdmin = verificarRol([1]);

// Middleware para usuarios con rol de empleado o administrador (rol_id = 1 o 2)
const esEmpleado = verificarRol([1, 2]);

module.exports = {
    verificarRol,
    esAdmin,
    esEmpleado
};