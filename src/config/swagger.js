const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoT Platform API',
      version: '1.0.0',
      description: 'Documentación de la API de SmartCity',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desarrollo Local',
      },
      // Agregar aquí url cuando esté en la nube y eso
    ],
  },
  apis: ['./src/routes/*.js'],
};

// generar la especificación
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
