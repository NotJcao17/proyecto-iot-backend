const SensorModel = require('../models/sensor');
const DeviceModel = require('../models/device');
const ReadingModel = require('../models/reading')

const sensorService = {

    // getAll
    getAll: async () => {
        return await SensorModel.find({});
    },

    // getById
    getById: async (id) => {
        return await SensorModel.findById(id);
    },

    // create
    create: async (body) => {
        return await SensorModel.create(body);
    },

    // update
    update: async (id, body) => {
        return await SensorModel.findByIdAndUpdate(id, body, { new: true });
    },

    // delete
    delete: async (id) => {
        // validar que no tenga devices
        const deviceCount = await DeviceModel.countDocuments({ sensors: id });
        if (deviceCount > 0) {
            throw new Error('DISPOSITIVOS_ASOCIADOS');
        }
        const readingCount = await ReadingModel.countDocuments({ sensorId: id});
        if (readingCount > 0) {
            throw new Error("LECTURAS_ASOCIADAS")
        }
        // validar que no esté activo
        const sensor = await SensorModel.findById(id);
        if (!sensor){
            return null;
        }
        if (sensor.isActive){
            throw new Error('SENSOR_ACTIVO')
        }
        // borrar
        return await SensorModel.findByIdAndDelete(id);
    }
};

module.exports = sensorService;