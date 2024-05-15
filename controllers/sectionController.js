const db = require('../config/db');

exports.createSection = async (req, res) => {
    try {
        const { section, coursecodeId } = req.body;
        if (!section || !coursecodeId) {
            return res.status(400).json({ message: 'Section and course ID are required' });
        }
        const [course] = await db.execute('SELECT * FROM course_codes WHERE id = ?', [coursecodeId]);
        if (course.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await db.execute('INSERT INTO section (section, coursecodeId) VALUES (?, ?)', [section, coursecodeId]);
        res.status(201).json({ message: 'Section created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAllSections = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT section.*, course_codes.course_code, course_codes.name FROM section JOIN course_codes ON section.coursecodeId = course_codes.id');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getSection = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT section.*, course_codes.course_code, course_codes.name FROM section JOIN course_codes ON section.coursecodeId = course_codes.id WHERE section.id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { section, coursecodeId } = req.body;
        if (!section || !coursecodeId) {
            return res.status(400).json({ message: 'Section and course ID are required' });
        }
        const [course] = await db.execute('SELECT * FROM course_codes WHERE id = ?', [coursecodeId]);
        if (course.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await db.execute('UPDATE section SET section = ?, coursecodeId = ? WHERE id = ?', [section, coursecodeId, id]);
        res.json({ message: 'Section updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM section WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Section not found' });
        }
        await db.execute('DELETE FROM section WHERE id = ?', [id]);
        res.json({ message: 'Section deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};