const db = require('../config/db');

exports.createAppointment = async (req, res) => {
    try {
        const { groupName, leaderLineID, courseCode, sectionCode, peerMentorId } = req.body;
        if (!groupName || !leaderLineID || !courseCode || !sectionCode || !peerMentorId) {
            return res.status(400).json({ message: 'groupName, leaderLineID, courseCode, sectionCode, and peerMentorId are required' });
        }
        await db.execute('INSERT INTO appointments (groupName, leaderLineID, courseCode, sectionCode, peerMentorId) VALUES (?, ?, ?, ?, ?)', [groupName, leaderLineID, courseCode, sectionCode, peerMentorId]);
        res.status(201).json({ message: 'Appointment created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM appointments');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM appointments WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { groupName, leaderLineID, courseCode, sectionCode, peerMentorId } = req.body;

        const updateFields = { groupName, leaderLineID, courseCode, sectionCode, peerMentorId };

        const definedFields = Object.entries(updateFields).filter(([key, value]) => value !== undefined);

        if (definedFields.length === 0) {
            return res.status(400).json({ message: 'At least one field (groupName, leaderLineID, courseCode, sectionCode, or peerMentorId) is required for update' });
        }

        const sqlQuery = 'UPDATE appointments SET ' + definedFields.map(([key]) => `${key} = ?`).join(', ') + ' WHERE id = ?';
        const updateValues = [...definedFields.map(([key, value]) => value), id];

        await db.execute(sqlQuery, updateValues);
        res.json({ message: 'Appointment updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.execute('SELECT * FROM appointments WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
        res.json({ message: 'Appointment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};