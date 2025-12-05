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
      {
        url: 'https://proyecto-iot-backend-eb.onrender.com/api', // <--- PEGA TU URL DE RENDER AQUÍ
        description: 'Servidor de Producción',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

// generar la especificación
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
