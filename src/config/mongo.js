const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    // Tomar url del .env
    const DB_URI = process.env.MONGO_URI;
    // Conexión a la base de datos
    await mongoose.connect(DB_URI);
    console.log('La conexión con la BD funciona');

  } catch (error) {
    console.log('La conexión con la BD no funciona', error);
  }
};

module.exports = dbConnect;