const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
    sensorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor',
        required: true
    },
    time: {
        type: Date,
        default: Date.now // Por si no la envían usar la de ahorita
    },
    value: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Reading', ReadingSchema);