const ReadingModel = require('../models/reading');
const SensorModel = require('../models/sensor');

const readingsService = {

    // getAll
    getAll: async () => {
        return await ReadingModel.find({});
    },

    // getById
    getById: async (id) => {
        return await ReadingModel.findById(id);
    },

    // create
    create: async (body) => {
        // Validar que vengan todos los campos requeridos (sensorId, value)
        // time tiene default, pero si viene debe ser validado.
        if (!body.sensorId || body.value === undefined) {
            // Nota: value puede ser 0, así que checar undefined
            // Pero el requerimiento dice "No crear si no vienen todos los campos"
            // Asumimos que sensorId y value son los obligatorios.
            // El modelo tiene required: true para estos.
            // Sin embargo, validaremos explícitamente si falta algo crítico antes de mongoose si se desea,
            // o dejamos que mongoose valide.
            // El requerimiento dice "No crear si no vienen todos los campos".
            // Vamos a validar explícitamente para consistencia.
        }

        // Validar sensorId
        const sensor = await SensorModel.findById(body.sensorId);
        if (!sensor) {
            throw new Error('SENSOR_NO_VALIDO');
        }

        // Validar value es number
        if (typeof body.value !== 'number') {
            throw new Error('VALUE_NO_ES_NUMBER');
        }

        // Validar fecha si viene
        if (body.time) {
            const date = new Date(body.time);
            if (isNaN(date.getTime())) {
                throw new Error('FECHA_INVALIDA');
            }
        }

        return await ReadingModel.create(body);
    },

    // update
    update: async (id, body) => {
        // Validar si existe el reading
        const reading = await ReadingModel.findById(id);
        if (!reading) {
            return null;
        }

        // Validar sensorId si viene
        if (body.sensorId) {
            const sensor = await SensorModel.findById(body.sensorId);
            if (!sensor) {
                throw new Error('SENSOR_NO_VALIDO');
            }
        }

        // Validar value si viene
        if (body.value !== undefined) {
            if (typeof body.value !== 'number') {
                throw new Error('VALUE_NO_ES_NUMBER');
            }
        }

        // Validar fecha si viene
        if (body.time) {
            const date = new Date(body.time);
            if (isNaN(date.getTime())) {
                throw new Error('FECHA_INVALIDA');
            }
        }

        return await ReadingModel.findByIdAndUpdate(id, body, { new: true });
    },

    // delete
    delete: async (id) => {
        // No hay restricciones específicas de borrado para Reading en el prompt
        // "Reading (get, getById, create, update, delete)"
        // "No crear/actualizar si no hay un sensor válido"
        // "No crear/actualizar si la fecha no es un date válido"
        // "No crear/actualizar si el value no es un number"
        return await ReadingModel.findByIdAndDelete(id);
    }
};

module.exports = readingsService;
