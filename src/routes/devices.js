const express = require('express');
const router = express.Router();
const deviceService = require('../services/deviceService');
const { handleHttpError } = require('../utils/handleError');

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: API para la gestión de dispositivos 
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       properties:
 *         serialNumber:
 *           type: string
 *           description: Número de serie único del dispositivo
 *         model:
 *           type: string
 *         ownerId:
 *           type: string
 *           description: ID del usuario dueño del dispositivo
 *         zoneId:
 *           type: string
 *           description: ID de la zona donde está instalado
 *         installedAt:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [active, maintenance, offline]
 *         sensors:
 *           type: array
 *           items:
 *             type: string
 *       required:
 *         - serialNumber
 *         - ownerId
 *         - zoneId
 */

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Obtiene todos los dispositivos
 *     tags: [Devices]
 *     responses:
 *       200:
 *         description: Lista de dispositivos obtenida exitosamente
 */
router.get('/', async (req, res) => {
    try {
        const devices = await deviceService.getAll();
        res.json(devices);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_DEVICES');
    }
});

/**
 * @swagger
 * /devices/{id}:
 *   get:
 *     summary: Obtiene un dispositivo por su ID
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispositivo encontrado
 *       404:
 *         description: Dispositivo no encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const device = await deviceService.getById(id);
        if (!device) {
            return handleHttpError(res, 'DEVICE_NOT_FOUND', 404);
        }
        res.json(device);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_DEVICE');
    }
});

/**
 * @swagger
 * /devices:
 *   post:
 *     summary: Crea un nuevo dispositivo
 *     tags: [Devices]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: Dispositivo creado exitosamente
 *       400:
 *         description: Error de validación (serial, owner, zone o sensores inválidos)
 */
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const newDevice = await deviceService.create(body);
        res.status(201).json(newDevice);
    } catch (e) {
        const errores = {
            SERIAL_NUMBER_EN_USO: 'SERIAL_NUMBER_EN_USO',
            USUARIO_NO_VALIDO: 'USUARIO_NO_VALIDO',
            ZONA_NO_VALIDA: 'ZONA_NO_VALIDA',
            SENSORES_NO_VALIDOS: 'SENSORES_NO_VALIDOS'
        };

        if (errores[e.message]) {
            return handleHttpError(res, errores[e.message], 400);
        }

        handleHttpError(res, 'ERROR_CREATE_DEVICE verifica los datos ingresados', 400);
    }
});

/**
 * @swagger
 * /devices/{id}:
 *   patch:
 *     summary: Actualiza un dispositivo
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       200:
 *         description: Dispositivo actualizado correctamente
 *       400:
 *         description: Datos inválidos (serial, owner, zone o sensores)
 *       404:
 *         description: Dispositivo no encontrado
 */
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updatedDevice = await deviceService.update(id, body);

        if (!updatedDevice) {
            return handleHttpError(res, 'DEVICE_NOT_FOUND', 404);
        }

        res.json(updatedDevice);
    } catch (e) {
        const errores = {
            SERIAL_NUMBER_EN_USO: 'SERIAL_NUMBER_EN_USO',
            USUARIO_NO_VALIDO: 'USUARIO_NO_VALIDO',
            ZONA_NO_VALIDA: 'ZONA_NO_VALIDA',
            SENSORES_NO_VALIDOS: 'SENSORES_NO_VALIDOS'
        };

        if (errores[e.message]) {
            return handleHttpError(res, errores[e.message], 400);
        }

        handleHttpError(res, 'ERROR_UPDATE_DEVICE verifica los datos ingresados', 400);
    }
});

/**
 * @swagger
 * /devices/{id}:
 *   delete:
 *     summary: Elimina un dispositivo
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dispositivo eliminado exitosamente
 *       404:
 *         description: Dispositivo no encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await deviceService.delete(id);

        if (!deleted) {
            return handleHttpError(res, 'DEVICE_NOT_FOUND', 404);
        }

        res.json({ message: 'Device Deleted', id });
    } catch (e) {
        handleHttpError(res, 'ERROR_DELETE_DEVICE');
    }
});

module.exports = router;
