const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser'); // Agregamos body-parser
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swaggerDef');

// Configuramos el puerto desde variable de entorno o por defecto
app.set('puerto', process.env.PORT || 4000);

// Middleware para registrar solicitudes en la consola (morgan)
app.use(morgan('dev'));

// Middleware para habilitar CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rutas para cada entidad (empleados, servicios, clientes, etc.)
app.use('/api', require('./routes/routesEmpleados.js'));
app.use('/api', require('./routes/routesServicios.js'));
app.use('/api', require('./routes/routesClientes.js'));
app.use('/api', require('./routes/routesTurnos.js'));
app.use('/api', require('./routes/routesUsuarios.js'));
app.use('/api', require('./routes/routesLogin.js'));
app.use('/api', require('./routes/routesRestablecerContrasena.js'));
app.use('/api', require('./routes/routesRoles.js'));

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta raíz para comprobar el estado del servidor
app.get('/', (req, res) => {
    res.json({ message: 'Servidor de FlowMint funcionando correctamente', status: 'success' });
});
// Iniciar el servidor
app.listen(app.get('puerto'), () => {
    console.log('El servidor de la peluquería está corriendo en el puerto', app.get('puerto'));
});
