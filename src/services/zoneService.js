const zoneModel = require('../models/zone');
const DeviceModel = require('../models/device');


const zoneService = {

    // getAll
    getAll: async () => {
        return await zoneModel.find({});
    },

    // getById
    getById: async (id) => {
        return await zoneModel.findById(id);
    },

    // create
    create: async (body) => {
        return await zoneModel.create(body);
    },

    // update
    update: async (id, body) => {
        return await zoneModel.findByIdAndUpdate(id, body, { new: true });
    },

    // delete
    delete: async (id) => {
        // validar que no tenga devices
        const deviceCount = await DeviceModel.countDocuments({ zoneId: id });
        if (deviceCount > 0) {
            throw new Error('DISPOSITIVOS_ASOCIADOS');
        }
        // validar que no esté activo
        const zone = await zoneModel.findById(id);
        if (!zone){
            return null;
        }
        if (zone.isActive){
            throw new Error('ZONA_ACTIVA')
        }
        // borrar
        return await zoneModel.findByIdAndDelete(id);
    }
};

module.exports = zoneService;