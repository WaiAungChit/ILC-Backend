const express = require('express');
const adminController = require('../controllers/adminController');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminCredentials:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *     AdminChangePassword:
 *       type: object
 *       required:
 *         - username
 *         - oldPassword
 *         - newPassword
 *       properties:
 *         username:
 *           type: string
 *         oldPassword:
 *           type: string
 *         newPassword:
 *           type: string
 */

/**
 * @swagger
 * /api/admin/signup:
 *   post:
 *     tags: [Admin]
 *     summary: Register a new admin
 *     description: Register a new admin by providing an email and a password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCredentials'
 *     responses:
 *       200:
 *         description: The admin was successfully created.
 *       400:
 *         description: Bad request. This can happen if the request body is not properly formatted or if an admin with the provided email already exists.
 */
router.route('/signup')
    .post(adminController.signup);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     tags: [Admin]
 *     summary: Log in an admin
 *     description: Log in an admin by providing an email and a password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminCredentials'
 *     responses:
 *       200:
 *         description: The admin was successfully logged in.
 *       400:
 *        description: Bad request. This can happen if the request body is not properly formatted or if the email or password is incorrect.
 */
router.route('/login')
    .post(adminController.login);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     tags: [Admin]
 *     summary: Log out an admin
 *     description: Log out an admin.
 *     responses:
 *       200:
 *         description: The admin was successfully logged out.
 */
router.route('/logout')
    .post(adminController.logout);

/**
 * @swagger
 * /api/admin/change-password:
 *   put:
 *     tags: [Admin]
 *     summary: Change the password of an admin
 *     description: Change the password of an admin by providing the old password and the new password.
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminChangePassword'
 *     responses:
 *       200:
 *         description: The password was successfully changed.
 *       400:
 *        description: Bad request. This can happen if the request body is not properly formatted or if the old password is incorrect.
 */
router.route('/change-password')
    .put(isAdmin, adminController.changePassword);

module.exports = router;