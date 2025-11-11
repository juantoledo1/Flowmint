const swaggerDef = {
  swagger: '2.0',
  info: {
    title: 'FlowMint API',
    version: '1.0.0',
    description: 'API para el sistema de gestión FlowMint para peluquerías',
  },
  host: 'localhost:4000',
  schemes: ['http'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'Endpoints para autenticación de usuarios',
    },
    {
      name: 'Usuarios',
      description: 'Endpoints para gestionar usuarios',
    },
    {
      name: 'Empleados',
      description: 'Endpoints para gestionar empleados',
    },
    {
      name: 'Clientes',
      description: 'Endpoints para gestionar clientes',
    },
    {
      name: 'Servicios',
      description: 'Endpoints para gestionar servicios',
    },
    {
      name: 'Turnos',
      description: 'Endpoints para gestionar turnos',
    },
  ],
};

module.exports = swaggerDef;