const db = require("../config/db");

exports.createAppointment = async (req, res) => {
    try {
        const {
            groupName,
            leaderLineID,
            courseCodeId,
            sectionCodeId,
            peerMentorId,
        } = req.body;
        if (
            !groupName ||
            !leaderLineID ||
            !courseCodeId ||
            !sectionCodeId ||
            !peerMentorId
        ) {
            return res.status(400).json({
                message:
                    "groupName, leaderLineID, courseCodeId, sectionCodeId, and peerMentorId are required",
            });
        }

        // Check if the provided courseCodeId exists
        const [courseRows] = await db.execute(
            "SELECT * FROM courseCodes WHERE id = ?",
            [courseCodeId]
        );
        if (courseRows.length === 0) {
            return res.status(400).json({ message: "Invalid courseCodeId" });
        }

        // Check if the provided sectionCode exists and belongs to the provided courseCodeId
        const [sectionRows] = await db.execute(
            "SELECT * FROM section WHERE id = ? AND courseCodeId = ?",
            [sectionCodeId, courseRows[0].id]
        );
        if (sectionRows.length === 0) {
            return res.status(400).json({
                message:
                    "Invalid sectionCode or it does not belong to the provided courseCodeId",
            });
        }

        await db.execute(
            "INSERT INTO appointments (groupName, leaderLineID, courseCode, sectionCode, peerMentorId) VALUES (?, ?, ?, ?, ?)",
            [
                groupName,
                leaderLineID,
                courseRows[0].id,
                sectionRows[0].id,
                peerMentorId,
            ]
        );
        res.status(201).json({ message: "Appointment created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT 
                a.id, 
                a.groupName, 
                a.leaderLineID, 
                c.courseCode, 
                s.section, 
                p.id as peerMentorId, 
                DATE_FORMAT(p.time, '%H:%i') as time,
                p.day, 
                p.name
            FROM appointments a
            JOIN courseCodes c ON a.courseCode = c.id
            JOIN section s ON a.sectionCode = s.id
            JOIN peerMentors p ON a.peerMentorId = p.id
        `);

        const formattedRows = rows.map((row) => ({
            id: row.id,
            groupName: row.groupName,
            leaderLineID: row.leaderLineID,
            courseCode: row.courseCode,
            section: row.section,
            peerMentor: {
                id: row.peerMentorId,
                time: row.time,
                day: row.day,
                name: row.name,
            },
        }));

        res.json(formattedRows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute(
            `
            SELECT 
                a.id, 
                a.groupName, 
                a.leaderLineID, 
                c.courseCode, 
                s.section, 
                p.id as peerMentorId, 
                p.time, 
                p.day, 
                p.name
            FROM appointments a
            JOIN courseCodes c ON a.courseCode = c.id
            JOIN section s ON a.sectionCode = s.id
            JOIN peerMentors p ON a.peerMentorId = p.id
            WHERE a.id = ?
        `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const appointment = rows.map((row) => ({
            id: row.id,
            groupName: row.groupName,
            leaderLineID: row.leaderLineID,
            courseCode: row.courseCode,
            section: row.section,
            peerMentor: {
                id: row.peerMentorId,
                time: row.time,
                day: row.day,
                name: row.name,
            },
        }))[0];

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            groupName,
            leaderLineID,
            courseCode,
            sectionCode,
            peerMentorId,
        } = req.body;

        // Check if the provided courseCode exists
        if (courseCode) {
            const [courseRows] = await db.execute(
                "SELECT * FROM courseCodes WHERE courseCode = ?",
                [courseCode]
            );
            if (courseRows.length === 0) {
                return res.status(400).json({ message: "Invalid courseCode" });
            }
        }

        // Check if the provided sectionCode exists and belongs to the provided courseCode
        if (sectionCode) {
            const [sectionRows] = await db.execute(
                "SELECT * FROM section WHERE section = ? AND courseCodeId = ?",
                [sectionCode, courseCode]
            );
            if (sectionRows.length === 0) {
                return res.status(400).json({
                    message:
                        "Invalid sectionCode or it does not belong to the provided courseCode",
                });
            }
        }

        const updateFields = {
            groupName,
            leaderLineID,
            sectionCode,
            peerMentorId,
        };

        const definedFields = Object.entries(updateFields).filter(
            ([key, value]) => value !== undefined
        );

        if (definedFields.length === 0) {
            return res.status(400).json({
                message:
                    "At least one field (groupName, leaderLineID, sectionCode, or peerMentorId) is required for update",
            });
        }

        const sqlQuery =
            "UPDATE appointments SET " +
            definedFields.map(([key]) => `${key} = ?`).join(", ") +
            " WHERE id = ?";
        const updateValues = [
            ...definedFields.map(([key, value]) => value),
            id,
        ];

        await db.execute(sqlQuery, updateValues);

        // Retrieve the updated appointment including peer mentor details
        const [updatedAppointmentRows] = await db.execute(
            `
            SELECT 
                a.id, 
                a.groupName, 
                a.leaderLineID, 
                c.courseCode, 
                s.section, 
                p.id as peerMentorId, 
                DATE_FORMAT(p.time, '%H:%i') as time,
                p.day, 
                p.name
            FROM appointments a
            JOIN courseCodes c ON a.courseCode = c.id
            JOIN section s ON a.sectionCode = s.id
            JOIN peerMentors p ON a.peerMentorId = p.id
            WHERE a.id = ?
        `,
            [id]
        );

        if (updatedAppointmentRows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const updatedAppointment = updatedAppointmentRows[0];
        const formattedAppointment = {
            id: updatedAppointment.id,
            groupName: updatedAppointment.groupName,
            leaderLineID: updatedAppointment.leaderLineID,
            courseCode: updatedAppointment.courseCode,
            section: updatedAppointment.section,
            peerMentor: {
                id: updatedAppointment.peerMentorId,
                time: updatedAppointment.time,
                day: updatedAppointment.day,
                name: updatedAppointment.name,
            },
        };

        res.json({
            message: "Appointment updated",
            appointment: formattedAppointment,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await db.execute(
            "SELECT * FROM appointments WHERE id = ?",
            [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        await db.execute("DELETE FROM appointments WHERE id = ?", [id]);
        res.json({ message: "Appointment deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
