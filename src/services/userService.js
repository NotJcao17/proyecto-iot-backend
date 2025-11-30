const UserModel = require('../models/user');
const DeviceModel = require('../models/device');


const userService = {

    // getAll
    getAll: async () => {
        return await UserModel.find({});
    },

    // getById
    getById: async (id) => {
        return await UserModel.findById(id);
    },

    // create
    create: async (body) => {
        // validar email
        const userExists = await UserModel.findOne({ email: body.email });
        if (userExists) {
            throw new Error('EMAIL_EN_USO'); 
        }
        // crear
        return await UserModel.create(body);
    },

    // update
    update: async (id, body) => {
        // si cambia el email
        if (body.email) {
            const userWithEmail = await UserModel.findOne({ email: body.email });
            // checar que no exista
            if (userWithEmail && userWithEmail._id.toString() !== id) {
                throw new Error('EMAIL_EN_USO');
            }
        }
        // actualizar
        return await UserModel.findByIdAndUpdate(id, body, { new: true });
    },

    // delete
    delete: async (id) => {
        // validar que no tenga devices
        const deviceCount = await DeviceModel.countDocuments({ ownerId: id });
        if (deviceCount > 0) {
            throw new Error('DISPOSITIVOS_ASOCIADOS');
        }
        // borrar
        return await UserModel.findByIdAndDelete(id);
    }
};

module.exports = userService;