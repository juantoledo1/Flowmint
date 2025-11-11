const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../database/database'); // Asegúrate de que esta ruta sea correcta
const routesUsuarios = require('./routesUsuarios'); // Ruta de usuarios
const { verifyGoogleToken } = require('../auth/googleAuth');

const router = express.Router();

// Middleware para verificar token
function verificarToken(req, res, next) {
    const bearer = req.headers['authorization'];
    if (typeof bearer !== 'undefined') {
        const token = bearer.split(" ")[1];
        jwt.verify(token, 'cortandoando', (error, valido) => {
            if (error) {
                res.sendStatus(403);
            } else {
                req.token = token;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

// Rutas públicas (sin necesidad de token)
router.use('/usuarios', routesUsuarios);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Authentication]
 *     summary: Iniciar sesión con credenciales de usuario
 *     description: Permite a un usuario iniciar sesión con su nombre de usuario y contraseña
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: credentials
 *         description: Credenciales de usuario
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *               example: "juan.perez"
 *             pass:
 *               type: string
 *               example: "contraseña123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *             mensaje:
 *               type: string
 *             token:
 *               type: string
 *             usuario:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                 rol_id:
 *                   type: integer
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', bodyParser.json(), (req, res) => {
    const { user, pass } = req.body;

    // Consulta para obtener el usuario por user
    const query = 'SELECT * FROM usuarios WHERE user = $1';
    pool.query(query, [user], (error, resultados) => {
        if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
        } else {
            // Verificar si se encontró un usuario con el user proporcionado
            if (resultados.rows.length > 0) {
                const usuario = resultados.rows[0];

                // Verificar la contraseña con bcrypt
                const passwordMatch = bcrypt.compareSync(pass.trim(), usuario.pass.trim());

                if (passwordMatch) {
                    // Generar token JWT
                    const token = jwt.sign({ id: usuario.usuario_id, user: usuario.user, rol_id: usuario.rol_id }, process.env.JWT_SECRET || 'cortandoando', { expiresIn: '1h' });

                    // Enviar el token como respuesta
                    res.json({ 
                        status: true, 
                        mensaje: "Inicio de sesión exitoso", 
                        token,
                        usuario: {
                            id: usuario.usuario_id,
                            nombre: usuario.nombre,
                            email: usuario.correo,
                            rol_id: usuario.rol_id
                        }
                    });
                } else {
                    res.json({ status: false, mensaje: "Contraseña incorrecta" });
                }
            } else {
                res.json({ status: false, mensaje: "Usuario no encontrado" });
            }
        }
    });
});

/**
 * @swagger
 * /google-login:
 *   post:
 *     tags: [Authentication]
 *     summary: Iniciar sesión con Google
 *     description: Permite a un usuario iniciar sesión con su cuenta de Google
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: Token de autenticación de Google
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Inicio de sesión con Google exitoso
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: boolean
 *             mensaje:
 *               type: string
 *             token:
 *               type: string
 *             usuario:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nombre:
 *                   type: string
 *                 email:
 *                   type: string
 *                 rol_id:
 *                   type: integer
 *       401:
 *         description: Token de Google inválido
 */
router.post('/google-login', bodyParser.json(), async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ status: false, mensaje: "Token de Google requerido" });
    }

    try {
        // Verificar el token de Google
        const googleUser = await verifyGoogleToken(token);
        
        if (!googleUser.success) {
            return res.status(401).json({ status: false, mensaje: googleUser.error });
        }

        // Verificar si el usuario ya existe en la base de datos
        const query = 'SELECT * FROM usuarios WHERE correo = $1';
        pool.query(query, [googleUser.email], (error, resultados) => {
            if (error) {
                console.log('Error en la base de datos', error);
                return res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
            }

            if (resultados.rows.length > 0) {
                // Usuario ya existe, iniciar sesión
                const usuario = resultados.rows[0];
                
                // Generar token JWT
                const jwtToken = jwt.sign(
                    { 
                        id: usuario.usuario_id, 
                        user: usuario.user, 
                        rol_id: usuario.rol_id 
                    }, 
                    process.env.JWT_SECRET || 'cortandoando', 
                    { expiresIn: '1h' }
                );

                res.json({ 
                    status: true, 
                    mensaje: "Inicio de sesión con Google exitoso", 
                    token: jwtToken,
                    usuario: {
                        id: usuario.usuario_id,
                        nombre: usuario.nombre,
                        email: usuario.correo,
                        rol_id: usuario.rol_id
                    }
                });
            } else {
                // Usuario no existe, crear uno nuevo si es necesario
                // En este caso, solo permitiremos acceso a usuarios previamente registrados
                res.json({ 
                    status: false, 
                    mensaje: "Usuario no registrado. Solo se permite acceso a usuarios previamente registrados." 
                });
            }
        });
    } catch (error) {
        console.error('Error en autenticación con Google:', error);
        res.status(500).json({ status: false, mensaje: "Error en autenticación con Google" });
    }
});

// Endpoint para cerrar sesión (Logout)
router.post('/logout', (req, res) => {
    // Aquí simplemente eliminamos el token, ya que no hay estado en el servidor para mantener la sesión
    res.json({ status: true, mensaje: "Cierre de sesión exitoso" });
});

// Otras rutas y configuraciones necesarias

module.exports = router;
