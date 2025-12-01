const express = require('express');
const router = express.Router();
const sensorService = require('../services/sensorService');
const { handleHttpError } = require('../utils/handleError'); // usen la función para que los errores se vean iguales

/**
 * @swagger
 * components:
 *   schemas:
 *     Sensor:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [temperature, humidity, co2, noise]
 *         unit:
 *           type: string
 *           enum: ["°C", "%", "ppm", "dB"]
 *         model:
 *           type: string
 *         location:
 *           type: string
 *           description: "Coordenadas en formato texto. Ejemplo: '19.4326,-99.1332'"
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Obtiene la lista de sensores
 *     responses:
 *       200:
 *         description: Lista de sensores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 */

// GET ALL
router.get('/', async (req, res) => {
    try {
        const sensors = await sensorService.getAll();
        res.json(sensors);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_SENSORS');
    }
});

/**
 * @swagger
 * /sensors/{id}:
 *   get:
 *     summary: Obtiene un sensor por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del sensor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: Sensor no encontrado
 */

// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const sensor = await sensorService.getById(id);
        if (!sensor) {
            return handleHttpError(res, 'SENSOR_NOT_FOUND', 404);
        }
        res.json(sensor);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_SENSOR');
    }
});
/**
 * @swagger
 * /sensors:
 *   post:
 *     summary: Crea un nuevo sensor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - unit
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [temperature, humidity, co2, noise]
 *               unit:
 *                 type: string
 *                 enum: ["°C", "%", "ppm", "dB"]
 *               model:
 *                 type: string
 *               location:
 *                 type: string
 *                 description: "Coordenadas en texto. Ejemplo: '19.4326,-99.1332'"
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Sensor creado correctamente
 *       400:
 *         description: Error de validación
 */

// POST
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const newSensor = await sensorService.create(body);
        res.status(201).json(newSensor);
    } catch (e) {
        handleHttpError(res, 'ERROR_CREATE_SENSOR');
    }
});
/**
 * @swagger
 * /sensors/{id}:
 *   patch:
 *     summary: Actualiza un sensor existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del sensor
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [temperature, humidity, co2, noise]
 *               unit:
 *                 type: string
 *                 enum: ["°C", "%", "ppm", "dB"]
 *               model:
 *                 type: string
 *               location:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sensor actualizado correctamente
 *       404:
 *         description: Sensor no encontrado
 */

// PATCH
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updatedSensor = await sensorService.update(id, body);
        if (!updatedSensor) {
            return handleHttpError(res, 'SENSOR_NOT_FOUND', 404);
        }
        res.json(updatedSensor);
    } catch (e) {
        handleHttpError(res, 'ERROR_UPDATE_SENSOR');
    }
});
/**
 * @swagger
 * /sensors/{id}:
 *   delete:
 *     summary: Elimina un sensor por ID
 *     description: |
 *       Solo se puede eliminar si:
 *       - No tiene dispositivos asociados
 *       - No tiene lecturas asociadas
 *       - El sensor está inactivo (isActive = false)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del sensor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sensor eliminado
 *       404:
 *         description: Sensor no encontrado
 *       400:
 *         description: El sensor no puede eliminarse por restricciones (devices/lecturas/activo)
 */

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await sensorService.delete(id);
        if (!result) {
            return handleHttpError(res, 'SENSOR_NOT_FOUND', 404);
        }
        res.json({ message: 'Sensor Deleted', id });
    } catch (e) {
        if (e.message === 'DISPOSITIVOS_ASOCIADOS') {
            return handleHttpError(res, 'DISPOSITIVOS_ASOCIADOS', 400);
        }
        if (e.message === 'LECTURAS_ASOCIADAS') {
            return handleHttpError(res, 'LECTURAS_ASOCIADAS', 400);
        }
        if (e.message === 'SENSOR_ACTIVO') {
            return handleHttpError(res, 'SENSOR_ACTIVO', 400);
        }

        // Error inesperado
        return handleHttpError(res, 'ERROR_DESCONOCIDO', 500);
    }
});

module.exports = router;