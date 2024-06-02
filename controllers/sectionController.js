const db = require("../config/db");

exports.createSection = async (req, res) => {
    try {
        const { section } = req.body;

        // Validate input
        if (!section) {
            return res.status(400).json({ message: "Section is required" });
        }

        // Check if the section already exists
        const [existingSection] = await db.execute(
            "SELECT section FROM sections WHERE section = ?",
            [section],
        );

        if (existingSection.length > 0) {
            return res.status(409).json({ message: "Section already exists" });
        }

        // Insert the new section
        const [result] = await db.execute(
            "INSERT INTO sections (section) VALUES (?)",
            [section],
        );

        // Retrieve the newly created section
        const [sectionRows] = await db.execute(
            "SELECT * FROM sections WHERE id = ?",
            [result.insertId],
        );

        const newSection = sectionRows[0];

        // Send the response with the created section data
        res.status(201).json({
            message: "Section created",
            section: newSection,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAllSections = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM sections");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getSection = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT * FROM sections WHERE id = ?", [
            id,
        ]);
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
            return res.status(400).json({ message: "Section is required" });
        }

        await db.execute("UPDATE sections SET section = ? WHERE id = ?", [
            section,
            id,
        ]);

        // Retrieve the updated section
        const [updatedSectionRows] = await db.execute(
            "SELECT * FROM sections WHERE id = ?",
            [id],
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
        const [rows] = await db.execute("SELECT * FROM sections WHERE id = ?", [
            id,
        ]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Section not found" });
        }
        await db.execute("DELETE FROM sections WHERE id = ?", [id]);
        res.json({ message: "Section deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
