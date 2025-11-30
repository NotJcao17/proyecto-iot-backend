const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Zone', ZoneSchema);