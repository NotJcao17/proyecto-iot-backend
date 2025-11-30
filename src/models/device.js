const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // FK
        required: true
    },
    zoneId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone', // FK
        required: true
    },
    installedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'offline'],
        default: 'active'
    },
    sensors: [{ // viene en plural así que estará como array
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sensor' // FK
    }]
});

module.exports = mongoose.model('Device', DeviceSchema);