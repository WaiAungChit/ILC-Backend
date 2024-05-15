const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        const [rows] = await db.execute('SELECT * FROM admin WHERE username = ?', [decoded.username]);
        if (rows.length === 0) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        req.user = decoded;
        next();
    });
};