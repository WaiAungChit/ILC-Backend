const db = require('../config/db');

exports.createCourse = async (req, res) => {
    try {
        const { course_code, name } = req.body;
        if (course_code === undefined || name === undefined) {
            return res.status(400).json({ message: 'Both code and name are required' });
        }
        await db.execute('INSERT INTO course_codes (course_code, name) VALUES (?, ?)', [course_code, name]);
        res.status(201).json({ message: 'Course created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM course_codes');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM course_codes WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { course_code, name } = req.body;

    const updateFields = { course_code, name };

    const definedFields = Object.entries(updateFields).filter(([key, value]) => value !== undefined);

    if (definedFields.length === 0) {
        return res.status(400).json({ message: 'At least one field (course_code or name) is required for update' });
    }

    const sqlQuery = 'UPDATE course_codes SET ' + definedFields.map(([key]) => `${key} = ?`).join(', ') + ' WHERE id = ?';
    const updateValues = [...definedFields.map(([key, value]) => value), id];

    try {
        await db.execute(sqlQuery, updateValues);
        res.json({ message: 'Course updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute('SELECT * FROM course_codes WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await db.execute('DELETE FROM course_codes WHERE id = ?', [id]);
        res.json({ message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};