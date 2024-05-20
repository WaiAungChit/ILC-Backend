const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const isAdmin = require('../middlewares/isAdmin');

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - courseCode
 *         - name
 *       properties:
 *         courseCode:
 *           type: string
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /api/courses:
 *   post:
 *     tags: [Courses]
 *     summary: Create a new course
 *     description: Create a new course by providing a course code and a name.
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: The course was successfully created.
 *       400:
 *         description: Bad request. This can happen if the request body is not properly formatted.
 *   get:
 *     tags: [Courses]
 *     summary: Get all courses
 *     description: Retrieve a list of all courses.
 *     responses:
 *       200:
 *         description: A list of courses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 */

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     tags: [Courses]
 *     summary: Get a course by ID
 *     description: Retrieve a specific course by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the course to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A specific course.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found.
 *   put:
 *     tags: [Courses]
 *     summary: Update a course
 *     description: Update a specific course by its ID.
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the course to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: The course was successfully updated.
 *       400:
 *         description: Bad request. This can happen if the request body is not properly formatted.
 *   delete:
 *     tags: [Courses]
 *     summary: Delete a course
 *     description: Delete a specific course by its ID.
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the course to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The course was successfully deleted.
 *       404:
 *         description: Course not found.
 */

router.route('/')
    .post(isAdmin, courseController.createCourse)
    .get(courseController.getCourses);

router.route('/:id')
    .get(courseController.getCourse)
    .put(isAdmin, courseController.updateCourse)
    .delete(isAdmin, courseController.deleteCourse);

module.exports = router;