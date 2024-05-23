const db = require("../config/db");

exports.createSection = async (req, res) => {
    try {
        const { section } = req.body;
        if (!section) {
            return res
                .status(400)
                .json({ message: "Section is required" });
        }
        await db.execute(
            "INSERT INTO section (section) VALUES (?)",
            [section]
        );
        res.status(201).json({ message: "Section created" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAllSections = async (req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM section"
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getSection = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(
            "SELECT * FROM section WHERE id = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Section not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { section } = req.body;

        if (!section) {
            return res
                .status(400)
                .json({ message: "Section is required" });
        }

        await db.execute(
            "UPDATE section SET section = ? WHERE id = ?",
            [section, id]
        );

        // Retrieve the updated section
        const [updatedSectionRows] = await db.execute(
            "SELECT * FROM section WHERE id = ?",
            [id]
        );

        if (updatedSectionRows.length === 0) {
            return res.status(404).json({ message: "Section not found" });
        }

        const updatedSection = updatedSectionRows[0];
        res.json({ message: "Section updated", section: updatedSection });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM section WHERE id = ?", [
            id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Section not found" });
        }
        await db.execute("DELETE FROM section WHERE id = ?", [id]);
        res.json({ message: "Section deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};