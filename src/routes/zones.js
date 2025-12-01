const express = require('express');
const router = express.Router();
const zoneService = require('../services/zoneService');
const { handleHttpError } = require('../utils/handleError');

/**
 * @swagger
 * tags:
 *   name: Zones
 *   description: API para la gestión de zonas geográficas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre de la zona
 *         description:
 *           type: string
 *           description: Detalles de la ubicación
 *         isActive:
 *           type: boolean
 *           description: Estado de la zona (true por defecto)
 *       required:
 *         - name
 *       example:
 *         name: Zona Norte
 *         description: Área industrial norte
 *         isActive: true
 */

/**
 * @swagger
 * /zones:
 *   get:
 *     summary: Obtiene la lista de todas las zonas
 *     tags: [Zones]
 *     responses:
 *       200:
 *         description: Lista de zonas obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zone'
 */
// GET ALL
router.get('/', async (req, res) => {
    try {
        const zones = await zoneService.getAll();
        res.json(zones);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_ZONES');
    }
});

/**
 * @swagger
 * /zones/{id}:
 *   get:
 *     summary: Obtiene una zona por ID
 *     tags: [Zones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Zona encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: Zona no encontrada
 */
// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const zone = await zoneService.getById(id);
        if (!zone) {
            return handleHttpError(res, 'ZONE_NOT_FOUND', 404);
        }
        res.json(zone);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_ZONE');
    }
});

/**
 * @swagger
 * /zones:
 *   post:
 *     summary: Crea una nueva zona
 *     tags: [Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Zone'
 *     responses:
 *       201:
 *         description: Zona creada correctamente
 *       400:
 *         description: Error al crear la zona
 */
// POST
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const newZone = await zoneService.create(body);
        res.status(201).json(newZone);
    } catch (e) {
        handleHttpError(res, 'ERROR_CREATE_ZONE');
    }
});

/**
 * @swagger
 * /zones/{id}:
 *   patch:
 *     summary: Actualiza una zona
 *     tags: [Zones]
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
 *             $ref: '#/components/schemas/Zone'
 *     responses:
 *       200:
 *         description: Zona actualizada
 *       404:
 *         description: Zona no encontrada
 */
// PATCH
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updatedZone = await zoneService.update(id, body);
        if (!updatedZone) {
             return handleHttpError(res, 'ZONE_NOT_FOUND', 404);
        }
        res.json(updatedZone);
    } catch (e) {
        handleHttpError(res, 'ERROR_UPDATE_ZONE');
    }
});

/**
 * @swagger
 * /zones/{id}:
 *   delete:
 *     summary: Elimina una zona
 *     tags: [Zones]
 *     description: No se puede eliminar si la zona tiene dispositivos asociados o si está activa (isActive=true).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Zona eliminada
 *       400:
 *         description: Error de validación (Zona activa o con dispositivos)
 *       404:
 *         description: Zona no encontrada
 */
// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await zoneService.delete(id);
        if (!result) {
             return handleHttpError(res, 'ZONE_NOT_FOUND', 404);
        }
        res.json({ message: 'Zone Deleted', id });
    } catch (e) {
        if (e.message === 'DISPOSITIVOS_ASOCIADOS') {
            handleHttpError(res, 'ZONE_HAS_DEVICES', 400);
        } else if (e.message === 'ZONA_ACTIVA') {
            handleHttpError(res, 'ZONE_IS_ACTIVE', 400);
        }else {
            handleHttpError(res, 'ERROR_DELETE_ZONE');
        }
    }
});

module.exports = router;