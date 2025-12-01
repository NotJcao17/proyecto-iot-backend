const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { handleHttpError } = require('../utils/handleError');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para la gestión de usuarios (Administradores, Técnicos, Visualizadores)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico único
 *         password:
 *           type: string
 *           format: password
 *         role:
 *           type: string
 *           enum: [admin, technician, viewer]
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       example:
 *         name: Juan Pérez
 *         email: juan@example.com
 *         password: secreto123
 *         role: admin
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene la lista de todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
// GET ALL
router.get('/', async (req, res) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (e) {
        handleHttpError(res, 'ERROR_GET_USERS');
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error de validación o email duplicado
 */
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

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Actualiza un usuario existente
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *       400:
 *         description: Email ya en uso por otro usuario
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Elimina un usuario
 *     tags: [Users]
 *     description: No se puede eliminar si el usuario tiene dispositivos asociados.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       400:
 *         description: No se puede eliminar (tiene dispositivos)
 *       404:
 *         description: Usuario no encontrado
 */
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