const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['temperature', 'humidity', 'co2', 'noise'],
        required: true
    },
    unit: {
        type: String,
        enum: ['°C', '%', 'ppm', 'dB'], //  Agregar decibeles, si no no tendría sentido que haya noise arriba
        required: true
    },
    model: {
        type: String
    },
    location: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Sensor', SensorSchema);