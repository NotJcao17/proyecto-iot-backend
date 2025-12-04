const DeviceModel = require('../models/device');
const SensorModel = require('../models/sensor');
const ZoneModel = require('../models/zone');
const UserModel = require('../models/user');

const deviceService = {

    //get all
    getAll: async () => {
        return await DeviceModel.find({});
    },

    //get by id
    getById: async () => {
        return await DeviceModel.findById(id);
    },

    //create
    create: async (body) => {
        //validar serial único
        const deviceExists = await DeviceModel.findOne({ serialNumber: body.serialNumber });
        if (deviceExists) {
            throw new Error('SERIAL_NUMBER_EN_USO');
        }
        //validar ownerId existente
        const userExists = await UserModel.findById(body.ownerId);
        if (!userExists) {
            throw new Error('USUARIO_NO_VALIDO');
        }
        //validar zoneId existente
        const zoneExists = await ZoneModel.findById(body.zoneId);
        if (!zoneExists) {
            throw new Error('ZONA_NO_VALIDA');
        }
        //validar sensores
        if (body.sensors && body.sensors.length > 0) {
            const count = await SensorModel.countDocuments({_id: { $in: body.sensors} });
            if (count !== body.sensors.length){
                throw new Error('SENSORES_NO_VALIDOS');
            }
        }
        return await DeviceModel.create(body);
    },

    //update
    update: async (id, body) => {
        //validar serialnum
        if (body.serialNumber) {
            const deviceWithSerial = await DeviceModel.findOne({ serialNumber: body.serialNumber });
            if (deviceWithSerial && deviceWithSerial._id.toString() !== id) {
                throw new Error('SERIAL_NUMBER_EN_USO');
            }
        }
        //validar ownerId
        if (body.ownerId) {
            const userExists = await UserModel.findById(body.ownerId);
            if (!userExists) {
                throw new Error('USUARIO_NO_VALIDO');
            }
        }
        //validar zoneId
        if (body.zoneId) {
            const zoneExists = await ZoneModel.findById(body.zoneId);
            if (!zoneExists){
                throw new Error('ZONA_NO_VALIDA');
            }
        }
        //validar sensores
        if (body.sensors && body.sensors.length > 0) {
            const count = await SensorModel.countDocuments({_id: { $in: body.sensors} });
            if (count !== body.sensors.length){
                throw new Error('SENSORES_NO_VALIDOS');
            }
        }
        return await DeviceModel.findByIdAndUpdate(id, body, { new: true });
    },

    //delete
    delete: async (id) => {
        return await DeviceModel.findByIdAndDelete(id);
    }
};

module.exports = deviceService;