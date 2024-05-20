const db = require('../config/db');
const mysql = require('mysql2');

exports.createPeerMentor = async (req, res) => {
    try {
        const { time, day, name } = req.body;
        if (time === undefined || day === undefined || name === undefined) {
            return res.status(400).json({ message: 'Time, day, and name are required' });
        }
        await db.execute('INSERT INTO peerMentors (time, day, name) VALUES (?, ?, ?)', [time, day, name]);
        res.status(201).json({ message: 'Peer mentor created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getPeerMentors = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.pageSize) || 10;

    if (isNaN(page) || page < 1) {
        return res.status(400).json({ message: 'Invalid page number' });
    }

    if (isNaN(pageSize) || pageSize < 1) {
        return res.status(400).json({ message: 'Invalid page size' });
    }

    pageSize = Math.min(pageSize, 30);

    const offset = (page - 1) * pageSize;

    try {
        const [rows] = await db.execute(`SELECT id, time, day, name FROM peerMentors LIMIT ${offset}, ${pageSize}`);
        const [total] = await db.execute('SELECT COUNT(*) as count FROM peerMentors');
        const formattedRows = rows.map(row => ({
            ...row,
            time: row.time.slice(0, 5),
        }));
        res.json({
            items: formattedRows,
            total: total[0].count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getPeerMentor = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT id, time, day, name FROM peerMentors WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Peer mentor not found' });
        }
        const formattedRow = {
            ...rows[0],
            time: rows[0].time.slice(0, 5),
        };
        res.json(formattedRow);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getPeerMentorsByTimeAndDay = async (req, res) => {
    const { time, day, name } = req.query;
    if (!time || !day) {
        return res.status(400).json({ message: 'Time and day are required' });
    }
    try {
        let query = 'SELECT id, time, day, name FROM peerMentors WHERE time = ? AND day = ?';
        let params = [time, day];

        if (name) {
            query += ' AND name = ?';
            params.push(name);
        }

        const [rows] = await db.execute(query, params);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'There is no peer mentor available at this time' });
        }
        const formattedRows = rows.map(row => ({
            ...row,
            time: row.time.slice(0, 5),
        }));
        res.json(formattedRows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updatePeerMentor = async (req, res) => {
    const { id } = req.params;
    const { time, day, name } = req.body;

    const updateFields = { time, day, name };

    const definedFields = Object.entries(updateFields).filter(([key, value]) => value !== undefined);

    if (definedFields.length === 0) {
        return res.status(400).json({ message: 'At least one field (time, day, or name) is required for update' });
    }

    try {
        const sqlQuery = 'UPDATE peerMentors SET ' + definedFields.map(([key]) => `${key} = ?`).join(', ') + ' WHERE id = ?';
        const updateValues = [...definedFields.map(([key, value]) => value), id];

        await db.execute(sqlQuery, updateValues);
        res.json({ message: 'Peer mentor updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deletePeerMentor = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM peerMentors WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Peer mentor not found' });
        }

        await db.execute('DELETE FROM peerMentors WHERE id = ?', [id]);
        res.json({ message: 'Peer mentor deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};