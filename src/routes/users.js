const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { handleHttpError } = require('../utils/handleError'); // usen la función para que los errores se vean iguales

// GET ALL
router.get('/', async (req, res) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_USERS');
    }
});

// GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userService.getById(id);
        if (!user) {
            return handleHttpError(res, 'USER_NOT_FOUND', 404);
        }
        res.json(user);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_USER');
    }
});

// POST
router.post('/', async (req, res) => {
    try {
        const body = req.body;
        const newUser = await userService.create(body);
        res.status(201).json(newUser);
    } catch (e) {
        if (e.message === 'EMAIL_EN_USO') {
            handleHttpError(res, 'EMAIL_EN_USO', 400);
        } else {
            handleHttpError(res, 'ERROR_CREATE_USER');
        }
    }
});

// PATCH
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const updatedUser = await userService.update(id, body);
        if (!updatedUser) {
             return handleHttpError(res, 'USER_NOT_FOUND', 404);
        }
        res.json(updatedUser);
    } catch (e) {
         if (e.message === 'EMAIL_EN_USO') {
            handleHttpError(res, 'EMAIL_EN_USO', 400);
        } else {
            handleHttpError(res, 'ERROR_UPDATE_USER');
        }
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await userService.delete(id);
        if (!result) {
             return handleHttpError(res, 'USER_NOT_FOUND', 404);
        }
        res.json({ message: 'User Deleted', id });
    } catch (e) {
        if (e.message === 'DISPOSITIVOS_ASOCIADOS') {
            handleHttpError(res, 'USER_HAS_DEVICES', 400);
        } else {
            handleHttpError(res, 'ERROR_DELETE_USER');
        }
    }
});

module.exports = router;