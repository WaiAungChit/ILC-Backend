const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { hashPassword, comparePassword } = require('../middlewares/passwordHash');

exports.signup = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM admin');
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const passwordHash = await hashPassword(password);
        await db.execute('INSERT INTO admin (username, password) VALUES (?, ?)', [username, passwordHash]);

        res.status(201).json({ message: 'Admin created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//admin login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM admin WHERE username = ?', [username]);
        if (rows.length === 0 || !(await comparePassword(password, rows[0].password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.logout = (req, res) => {
    // No action needed, frontend will remove the token
    res.json({ message: 'Logged out' });
};

exports.changePassword = async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    try {
        const [rows] = await db.execute('SELECT * FROM admin WHERE username = ?', [username]);
        if (rows.length === 0 || !(await comparePassword(oldPassword, rows[0].password))) {
            return res.status(401).json({ message: 'Invalid username or old password' });
        }

        const newPasswordHash = await hashPassword(newPassword);
        await db.execute('UPDATE admin SET password = ? WHERE username = ?', [newPasswordHash, username]);

        res.json({ message: 'Password changed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};