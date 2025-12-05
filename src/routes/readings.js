const express = require('express');
const router = express.Router();
const readingsService = require('../services/readingsService');
const { handleHttpError } = require('../utils/handleError');

/**
 * @swagger
 * tags:
 *   name: Readings
 *   description: API para la gestión de lecturas de sensores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Reading:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         sensorId:
 *           type: string
 *           description: ID del sensor asociado
 *         time:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la lectura
 *         value:
 *           type: number
 *           description: Valor de la lectura
 */

/**
 * @swagger
 * /readings:
 *   get:
 *     summary: Obtiene la lista de lecturas
 *     tags: [Readings]
 *     responses:
 *       200:
 *         description: Lista de lecturas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reading'
 */

// GET ALL
router.get('/', async (req, res) => {
    try {
        const readings = await readingsService.getAll();
        res.json(readings);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_READINGS');
    }
});

/**
 * @swagger
 * /readings/{id}:
 *   get:
 *     summary: Obtiene una lectura por ID
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la lectura
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lectura encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reading'
 *       404:
 *         description: Lectura no encontrada
 */

// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const reading = await readingsService.getById(id);
        if (!reading) {
            return handleHttpError(res, 'READING_NOT_FOUND', 404);
        }
        res.json(reading);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_READING');
    }
});

/**
 * @swagger
 * /readings:
 *   post:
 *     summary: Crea una nueva lectura
 *     tags: [Readings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sensorId
 *               - value
 *             properties:
 *               sensorId:
 *                 type: string
 *               time:
 *                 type: string
 *                 format: date-time
 *               value:
 *                 type: number
 *     responses:
 *       201:
 *         description: Lectura creada correctamente
 *       400:
 *         description: Error de validación (sensor inválido, fecha inválida, valor no numérico)
 */

// POST
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const newReading = await readingsService.create(body);
        res.status(201).json(newReading);
    } catch (e) {
        if (e.message === 'SENSOR_NO_VALIDO') {
            return handleHttpError(res, 'SENSOR_NO_VALIDO', 400);
        }
        if (e.message === 'VALUE_NO_ES_NUMBER') {
            return handleHttpError(res, 'VALUE_NO_ES_NUMBER', 400);
        }
        if (e.message === 'FECHA_INVALIDA') {
            return handleHttpError(res, 'FECHA_INVALIDA', 400);
        }
        handleHttpError(res, 'ERROR_CREATE_READING verifica los datos ingresados', 400);
    }
});

/**
 * @swagger
 * /readings/{id}:
 *   patch:
 *     summary: Actualiza una lectura existente
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la lectura
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sensorId:
 *                 type: string
 *               time:
 *                 type: string
 *                 format: date-time
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Lectura actualizada correctamente
 *       404:
 *         description: Lectura no encontrada
 *       400:
 *         description: Error de validación
 */

// PATCH
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updatedReading = await readingsService.update(id, body);
        if (!updatedReading) {
            return handleHttpError(res, 'READING_NOT_FOUND', 404);
        }
        res.json(updatedReading);
    } catch (e) {
        if (e.message === 'SENSOR_NO_VALIDO') {
            return handleHttpError(res, 'SENSOR_NO_VALIDO', 400);
        }
        if (e.message === 'VALUE_NO_ES_NUMBER') {
            return handleHttpError(res, 'VALUE_NO_ES_NUMBER', 400);
        }
        if (e.message === 'FECHA_INVALIDA') {
            return handleHttpError(res, 'FECHA_INVALIDA', 400);
        }
        handleHttpError(res, 'ERROR_UPDATE_READING verifica los datos ingresados', 400);
    }
});

/**
 * @swagger
 * /readings/{id}:
 *   delete:
 *     summary: Elimina una lectura por ID
 *     tags: [Readings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la lectura
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lectura eliminada
 *       404:
 *         description: Lectura no encontrada
 */

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await readingsService.delete(id);
        if (!result) {
            return handleHttpError(res, 'READING_NOT_FOUND', 404);
        }
        res.json({ message: 'Reading Deleted', id });
    } catch (e) {
        handleHttpError(res, 'ERROR_DELETE_READING');
    }
});

module.exports = router;
