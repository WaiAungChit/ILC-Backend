const express = require("express");
const router = express.Router();
const peerMentorController = require("../controllers/peerMentorController");
const isAdmin = require("../middlewares/isAdmin");

/**
 * @swagger
 * components:
 *   schemas:
 *     PeerMentor:
 *       type: object
 *       required:
 *         - time
 *         - day
 *         - name
 *       properties:
 *         time:
 *           type: string
 *         day:
 *           type: string
 *         name:
 *           type: string
 */

/**
 * @swagger
 * /api/peerMentors:
 *   post:
 *     tags: [PeerMentors]
 *     summary: Create a new peer mentor
 *     description: Create a new peer mentor with the provided time, day, and name.
 *     security:
 *       - adminAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeerMentor'
 *     responses:
 *       201:
 *         description: Peer mentor created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request. This can happen if the time, day, or name is not provided.
 *       500:
 *         description: Server error.
 */
/**
 * @swagger
 * /api/peerMentors:
 *   get:
 *     tags: [PeerMentors]
 *     summary: Get peer mentors with optional filtering
 *     description: Retrieve a list of peer mentors with optional filtering by day and time.
 *     parameters:
 *       - in: query
 *         name: day
 *         required: false
 *         description: Filter peer mentors by day (e.g., Monday, Tuesday).
 *         schema:
 *           type: string
 *       - in: query
 *         name: time
 *         required: false
 *         description: Filter peer mentors by time (e.g., 09:00, 14:00).
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Limit the number of results returned.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of peer mentors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PeerMentor'
 *                 total:
 *                   type: integer
 *       400:
 *         description: Bad request. This can happen if the limit is not a positive integer.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/peerMentors/paginated:
 *   get:
 *     tags: [PeerMentors]
 *     summary: Get paginated peer mentors with optional filtering
 *     description: Retrieve a list of paginated peer mentors with optional filtering by day and time.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number to retrieve. Defaults to 1 if not provided.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         required: false
 *         description: The number of records per page. Defaults to 10 if not provided. Maximum is 30.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: day
 *         required: false
 *         description: Filter peer mentors by day (e.g., Monday, Tuesday).
 *         schema:
 *           type: string
 *       - in: query
 *         name: time
 *         required: false
 *         description: Filter peer mentors by time (e.g., 09:00, 14:00).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of paginated peer mentors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PeerMentor'
 *                 total:
 *                   type: integer
 *       400:
 *         description: Bad request. This can happen if the page or pageSize is not a positive integer.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /api/peerMentors/{id}:
 *   get:
 *     tags: [PeerMentors]
 *     summary: Get a peer mentor by ID
 *     description: Retrieve a specific peer mentor by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the peer mentor to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A specific peer mentor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PeerMentor'
 *       404:
 *         description: Peer mentor not found.
 *   put:
 *     tags: [PeerMentors]
 *     summary: Update a peer mentor
 *     description: Update a specific peer mentor by its ID.
 *     security:
 *        - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the peer mentor to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeerMentor'
 *     responses:
 *       200:
 *         description: The peer mentor was successfully updated.
 *       400:
 *         description: Bad request. This can happen if the request body is not properly formatted.
 *   delete:
 *     tags: [PeerMentors]
 *     summary: Delete a peer mentor
 *     description: Delete a specific peer mentor by its ID.
 *     security:
 *       - adminAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the peer mentor to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The peer mentor was successfully deleted.
 *       404:
 *         description: Peer mentor not found.
 */

/**
 * @swagger
 * /api/peerMentors/filter:
 *   get:
 *     tags: [PeerMentors]
 *     summary: Get peer mentors by time and day
 *     description: Retrieve a list of peer mentors that match the given time and day. Optionally, a name can also be provided to further filter the results.
 *     parameters:
 *       - in: query
 *         name: time
 *         required: true
 *         description: Time to filter the peer mentors by.
 *         schema:
 *           type: string
 *       - in: query
 *         name: day
 *         required: true
 *         description: Day to filter the peer mentors by.
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         required: false
 *         description: Name to filter the peer mentors by.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of peer mentors that match the given time, day, and optionally name.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PeerMentor'
 *       400:
 *         description: Bad request. This can happen if the time or day is not provided.
 */

router
    .route("/")
    .post(isAdmin, peerMentorController.createPeerMentor)
    .get(peerMentorController.getPeerMentors);

router.route("/paginated").get(peerMentorController.getPaginatedPeerMentors);

router.route("/filter").get(peerMentorController.getPeerMentorsByTimeAndDay);

router
    .route("/:id")
    .get(peerMentorController.getPeerMentor)
    .put(isAdmin, peerMentorController.updatePeerMentor)
    .delete(isAdmin, peerMentorController.deletePeerMentor);

module.exports = router;
