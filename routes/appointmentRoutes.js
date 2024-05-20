const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const isAdmin = require('../middlewares/isAdmin');

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - groupName
 *         - leaderLineID
 *         - courseCode
 *         - sectionCode
 *         - peerMentorId
 *       properties:
 *         groupName:
 *           type: string
 *           example: "BlahBlah"
 *         leaderLineID:
 *           type: string
 *           example: "jojo"
 *         courseCodeId:
 *           type: integer
 *           example: 3  
 *         sectionCodeId:
 *           type: integer
 *           example: 4 
 *         peerMentorId:
 *           type: integer 
 *           example: 7
 */
/**
 * @swagger
 * /api/appointments:
 *   post:
 *     tags: [Appointment]
 *     summary: Create a new appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: The appointment was successfully created.
 *       400:
 *         description: There was an error creating the appointment.
 *       500:
 *         description: There was a server error creating the appointment.
 *   get:
 *     tags: [Appointment]
 *     summary: Get all appointments
 *     security:
 *       - adminAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments.
 *       400:
 *         description: There was an error retrieving the appointments.
 *       500:
 *         description: There was a server error retrieving the appointments.
 */
router.route('/')
    .post(appointmentController.createAppointment)
    .get(isAdmin, appointmentController.getAppointments);

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     tags: [Appointment]
 *     summary: Get an appointment by ID
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: An appointment.
 *       404:
 *         description: The appointment was not found.
 *       500:
 *         description: There was a server error retrieving the appointment.
 *   put:
 *     tags: [Appointment]
 *     summary: Update an appointment by ID
 *     security:
 *       - adminAuth: []
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
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: The appointment was successfully updated.
 *       400:
 *         description: There was an error updating the appointment.
 *       500:
 *         description: There was a server error updating the appointment.
 *   delete:
 *     tags: [Appointment]
 *     summary: Delete an appointment by ID
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The appointment was successfully deleted.
 *       404:
 *         description: The appointment was not found.
 *       500:
 *         description: There was a server error deleting the appointment.
 */
router.route('/:id')
    .get(isAdmin, appointmentController.getAppointment)
    .put(isAdmin, appointmentController.updateAppointment)
    .delete(isAdmin, appointmentController.deleteAppointment);

module.exports = router;