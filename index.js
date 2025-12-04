const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Para las variables env
const dbConnect = require('./src/config/mongo');
const errorMiddleware = require('./src/middleware/errorMiddleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Para conexiones externas
app.use(express.json()); // Para que el server entienda JSON

// Ruta para swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/users', require('./src/routes/users'));
app.use('/api/zones', require('./src/routes/zones'));
app.use('/api/sensors', require('./src/routes/sensors'))
app.use('/api/readings', require('./src/routes/readings'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Al menos el servidor funciona');
});

// Middleware para errores
app.use(errorMiddleware);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
  dbConnect();
});