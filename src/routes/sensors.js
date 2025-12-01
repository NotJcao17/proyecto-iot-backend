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
 *           enum: ["°C", "%", "ppm"]
 *         model:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: number
 *             lng:
 *               type: number
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
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [temperature, humidity, co2, noise]
 *               unit:
 *                 type: string
 *                 enum: ["°C", "%", "ppm"]
 *               model:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Sensor creado correctamente
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
 *               unit:
 *                 type: string
 *               model:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sensor actualizado
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
        
    }
});

module.exports = router;