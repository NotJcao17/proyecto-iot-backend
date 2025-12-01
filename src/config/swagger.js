const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use('/app-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { swaggerSpec, setupSwagger };
