const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysqlConnect = require('../database/database');

// Verificar token JWT
function verificarToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403); // Forbidden si no hay token
  }
}

// Middleware para verificar rol
function verificarRol(rolesPermitidos) {
  return (req, res, next) => {
    const bearer = req.headers['authorization'];
    if (typeof bearer === 'undefined') {
      return res.status(403).json({ status: false, mensaje: "No hay token de autorización" });
    }

    const token = bearer.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(403).json({ status: false, mensaje: "Token inválido" });
      }

      // Obtener el rol del usuario desde la base de datos
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
}

// Middleware específico para usuarios con rol de administrador (rol_id = 1)
const esAdmin = verificarRol([1]);

// Middleware para usuarios con rol de empleado o administrador (rol_id = 1 o 2)
const esEmpleado = verificarRol([1, 2]);

// Listar usuarios
router.get('/listar_usuarios', esEmpleado, (req, res) => {
  mysqlConnect.query('SELECT usuario_id, nombre, apellido, dni, user, correo, rol_id, estado FROM usuarios', (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      res.json(registros);
    }
  });
});

// Obtener un usuario por ID
router.get('/usuarios/:id_usuario', esEmpleado, (req, res) => {
  const { id_usuario } = req.params;
  mysqlConnect.query('SELECT usuario_id, nombre, apellido, dni, user, correo, rol_id, estado FROM usuarios WHERE usuario_id = ?', [id_usuario], (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      if (registros.length > 0) {
        res.json(registros);
      } else {
        res.json({ status: false, mensaje: "El ID del usuario no existe" });
      }
    }
  });
});

// Crear un nuevo usuario
router.post('/crear_usuario', (req, res) => {
  const { nombre, apellido, dni, user, pass, correo } = req.body;
  // Hash de la contraseña antes de almacenarla en la base de datos
  const hashedPassword = bcrypt.hashSync(pass, 10);

  // Verificar que los campos requeridos estén presentes
  if (!nombre || !apellido || !user || !pass) {
    return res.status(400).json({ 
      status: false, 
      mensaje: "Los campos nombre, apellido, user y pass son requeridos" 
    });
  }

  mysqlConnect.query('SELECT COUNT(*) as count FROM usuarios', (error, results) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      const rol_id = results[0].count === 0 ? 1 : 2;
      mysqlConnect.query('INSERT INTO usuarios (nombre, apellido, dni, user, pass, correo, rol_id, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, dni || null, user, hashedPassword, correo || null, rol_id, 'A'], (error, resultados) => {
          if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
          } else {
            res.json({ status: true, mensaje: "El usuario se creó correctamente" });
          }
        });
    }
  });
});

// Actualizar un usuario por ID
router.put('/actualizar_usuario/:id_usuario', esAdmin, (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, apellido, dni, user, correo, rol_id } = req.body;
  // Obtener la contraseña actual para no sobrescribirla accidentalmente
  const { pass } = req.body; // Obtener contraseña del body si se proporciona
  let passwordUpdate = "";
  let queryParams = [];

  if (pass) {
    const hashedPassword = bcrypt.hashSync(pass, 10);
    passwordUpdate = ", pass = ?";
    queryParams = [nombre, apellido, dni, user, hashedPassword, correo, rol_id, id_usuario];
  } else {
    passwordUpdate = "";
    queryParams = [nombre, apellido, dni, user, correo, rol_id, id_usuario];
  }

  mysqlConnect.query(`UPDATE usuarios SET nombre = ?, apellido = ?, dni = ?, user = ?, correo = ?, rol_id = ? ${passwordUpdate} WHERE usuario_id = ?`,
    queryParams, (error, registros) => {
      if (error) {
        console.log('Error en la base de datos', error);
        res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
      } else {
        if (registros.affectedRows > 0) {
          res.json({ status: true, mensaje: "El usuario se actualizó correctamente" });
        } else {
          res.json({ status: false, mensaje: "El ID del usuario no existe" });
        }
      }
    });
});

// Eliminar un usuario por ID
router.delete('/eliminar_usuario/:id_usuario', esAdmin, (req, res) => {
  const { id_usuario } = req.params;
  mysqlConnect.query('DELETE FROM usuarios WHERE usuario_id = ?', [id_usuario], (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      if (registros.affectedRows > 0) {
        res.json({ status: true, mensaje: "El usuario se eliminó correctamente" });
      } else {
        res.json({ status: false, mensaje: "El ID del usuario no existe" });
      }
    }
  });
});

// Listar usuarios
router.get('/listar_usuarios', esEmpleado, (req, res) => {
  mysqlConnect.query('SELECT usuario_id, nombre, apellido, dni, user, correo, rol_id, estado FROM usuarios', (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      res.json(registros);
    }
  });
});

// Obtener un usuario por ID
router.get('/usuarios/:id_usuario', esEmpleado, (req, res) => {
  const { id_usuario } = req.params;
  mysqlConnect.query('SELECT usuario_id, nombre, apellido, dni, user, correo, rol_id, estado FROM usuarios WHERE usuario_id = ?', [id_usuario], (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      if (registros.length > 0) {
        res.json(registros);
      } else {
        res.json({ status: false, mensaje: "El ID del usuario no existe" });
      }
    }
  });
});

// Crear un nuevo usuario
router.post('/crear_usuario', (req, res) => {
  const { nombre, apellido, dni, user, pass, correo } = req.body;
  // Hash de la contraseña antes de almacenarla en la base de datos
  const hashedPassword = bcrypt.hashSync(pass, 10);

  // Verificar que los campos requeridos estén presentes
  if (!nombre || !apellido || !user || !pass) {
    return res.status(400).json({ 
      status: false, 
      mensaje: "Los campos nombre, apellido, user y pass son requeridos" 
    });
  }

  mysqlConnect.query('SELECT COUNT(*) as count FROM usuarios', (error, results) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      const rol_id = results[0].count === 0 ? 1 : 2;
      mysqlConnect.query('INSERT INTO usuarios (nombre, apellido, dni, user, pass, correo, rol_id, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido, dni || null, user, hashedPassword, correo || null, rol_id, 'A'], (error, resultados) => {
          if (error) {
            console.log('Error en la base de datos', error);
            res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
          } else {
            res.json({ status: true, mensaje: "El usuario se creó correctamente" });
          }
        });
    }
  });
});

// Actualizar un usuario por ID
router.put('/actualizar_usuario/:id_usuario', esAdmin, (req, res) => {
  const { id_usuario } = req.params;
  const { nombre, apellido, dni, user, correo, rol_id } = req.body;
  // Hash de la contraseña antes de almacenarla en la base de datos
  const hashedPassword = bcrypt.hashSync(pass, 10);

  mysqlConnect.query('UPDATE usuarios SET nombre = ?, apellido = ?, dni = ?, user = ?, pass = ?, correo = ?, rol_id = ? WHERE usuario_id = ?',
    [nombre, apellido, dni, user, hashedPassword, correo, rol_id, id_usuario], (error, registros) => {
      if (error) {
        console.log('Error en la base de datos', error);
        res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
      } else {
        if (registros.affectedRows > 0) {
          res.json({ status: true, mensaje: "El usuario se actualizó correctamente" });
        } else {
          res.json({ status: false, mensaje: "El ID del usuario no existe" });
        }
      }
    });
});

// Eliminar un usuario por ID
router.delete('/eliminar_usuario/:id_usuario', esAdmin, (req, res) => {
  const { id_usuario } = req.params;
  mysqlConnect.query('DELETE FROM usuarios WHERE usuario_id = ?', [id_usuario], (error, registros) => {
    if (error) {
      console.log('Error en la base de datos', error);
      res.status(500).json({ status: false, mensaje: "Error en la base de datos" });
    } else {
      if (registros.affectedRows > 0) {
        res.json({ status: true, mensaje: "El usuario se eliminó correctamente" });
      } else {
        res.json({ status: false, mensaje: "El ID del usuario no existe" });
      }
    }
  });
});

module.exports = router;
