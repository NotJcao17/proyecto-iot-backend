const express = require('express');
const router = express.Router();
const zoneService = require('../services/zoneService');
const { handleHttpError } = require('../utils/handleError');

// GET ALL
router.get('/', async (req, res) => {
    try {
        const zones = await zoneService.getAll();
        res.json(zones);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_ZONES');
    }
});

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