const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const isAdmin = require('../middlewares/isAdmin');

/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       required:
 *         - section
 *         - coursecodeId
 * 
 *       properties:
 *         section:
 *           type: integer
 *         coursecodeId:
 *           type: integer
 */

/**
 * @swagger
 * /api/sections:
 *   post:
 *     tags: [Section]
 *     summary: Create a new section
 *     description: Create a new section by providing a section code.
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Section'
 *     responses:
 *       201:
 *         description: The section was successfully created.
 *       400:
 *         description: Bad request. This can happen if the section code is not provided.
 *   get:
 *     tags: [Section]
 *     summary: Get all sections
 *     description: Retrieve all sections.
 *     responses:
 *       200:
 *         description: A list of sections.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 */
router.route('/')
    .post(isAdmin, sectionController.createSection)
    .get(sectionController.getAllSections);

/**
 * @swagger
 * /api/sections/{id}:
 *   get:
 *     tags: [Section]
 *     summary: Get a section
 *     description: Retrieve a section by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The section ID.
 *     responses:
 *       200:
 *         description: The section information.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Section'
 *       404:
 *         description: Section not found.
 *   put:
 *     tags: [Section]
 *     summary: Update a section
 *     description: Update a section by providing a new section code.
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The section ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Section'
 *     responses:
 *       200:
 *         description: The section was successfully updated.
 *       400:
 *         description: Bad request. This can happen if the section code is not provided.
 *   delete:
 *     tags: [Section]
 *     summary: Delete a section
 *     description: Delete a section by its ID.
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The section ID.
 *     responses:
 *       200:
 *         description: The section was successfully deleted.
 *       404:
 *         description: Section not found.
 */
router.route('/:id')
    .get(sectionController.getSection)
    .put(isAdmin, sectionController.updateSection)
    .delete(isAdmin, sectionController.deleteSection);

module.exports = router;
