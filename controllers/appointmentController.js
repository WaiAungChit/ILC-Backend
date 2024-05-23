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
                c.id as courseId,
                c.courseCode, 
                c.name as courseName,
                s.id as sectionId,
                s.section, 
                s.courseCodeId,
                s.name as sectionName,
                p.id as peerMentorId, 
                DATE_FORMAT(p.time, '%H:%i') as time,
                p.day, 
                p.name as peerMentorName
            FROM appointments a
            JOIN courseCodes c ON a.courseCode = c.id
            JOIN section s ON a.sectionCode = s.id
            JOIN peerMentors p ON a.peerMentorId = p.id
        `);

        const formattedRows = rows.map((row) => ({
            id: row.id,
            groupName: row.groupName,
            leaderLineID: row.leaderLineID,
            course: {
                id: row.courseId,
                courseCode: row.courseCode,
                name: row.courseName,
            },
            section: {
                id: row.sectionId,
                section: row.section,
                courseCodeId: row.courseCodeId,
                name: row.sectionName,
            },
            peerMentor: {
                id: row.peerMentorId,
                time: row.time,
                day: row.day,
                name: row.peerMentorName,
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
                c.id as courseId,
                c.courseCode, 
                c.name as courseName,
                s.id as sectionId,
                s.section, 
                s.courseCodeId,
                s.name as sectionName,
                p.id as peerMentorId, 
                DATE_FORMAT(p.time, '%H:%i') as time,
                p.day, 
                p.name as peerMentorName
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

        const appointment = {
            id: rows[0].id,
            groupName: rows[0].groupName,
            leaderLineID: rows[0].leaderLineID,
            course: {
                id: rows[0].courseId,
                courseCode: rows[0].courseCode,
                name: rows[0].courseName,
            },
            section: {
                id: rows[0].sectionId,
                section: rows[0].section,
                courseCodeId: rows[0].courseCodeId,
                name: rows[0].sectionName,
            },
            peerMentor: {
                id: rows[0].peerMentorId,
                time: rows[0].time,
                day: rows[0].day,
                name: rows[0].peerMentorName,
            },
        };

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
            courseCodeId,
            sectionId,
            peerMentorId,
        } = req.body;

        // Check if the provided courseCodeId exists
        if (courseCodeId !== undefined) {
            const [courseRows] = await db.execute(
                "SELECT * FROM courseCodes WHERE id = ?",
                [courseCodeId]
            );
            if (courseRows.length === 0) {
                return res
                    .status(400)
                    .json({ message: "Invalid courseCodeId" });
            }
        }

        // Check if the provided sectionId exists and belongs to the provided courseCodeId
        if (sectionId !== undefined && courseCodeId !== undefined) {
            const [sectionRows] = await db.execute(
                "SELECT * FROM section WHERE id = ? AND courseCodeId = ?",
                [sectionId, courseCodeId]
            );
            if (sectionRows.length === 0) {
                return res.status(400).json({
                    message:
                        "Invalid sectionId or it does not belong to the provided courseCodeId",
                });
            }
        }

        const updateFields = {
            groupName,
            leaderLineID,
            courseCodeId,
            sectionId,
            peerMentorId,
        };

        const definedFields = Object.entries(updateFields).filter(
            ([, value]) => value !== undefined
        );

        if (definedFields.length === 0) {
            return res.status(400).json({
                message:
                    "At least one field (groupName, leaderLineID, courseCodeId, sectionId, or peerMentorId) is required for update",
            });
        }

        const sqlQuery =
            "UPDATE appointments SET " +
            definedFields.map(([key]) => `${key} = ?`).join(", ") +
            " WHERE id = ?";
        const updateValues = [...definedFields.map(([, value]) => value), id];

        await db.execute(sqlQuery, updateValues);

        // Retrieve the updated appointment including peer mentor details
        const [updatedAppointmentRows] = await db.execute(
            `
            SELECT 
                a.id, 
                a.groupName, 
                a.leaderLineID, 
                c.id as courseId,
                c.courseCode, 
                c.name as courseName,
                s.id as sectionId,
                s.section, 
                s.courseCodeId,
                s.name as sectionName,
                p.id as peerMentorId, 
                DATE_FORMAT(p.time, '%H:%i') as time,
                p.day, 
                p.name as peerMentorName
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
            course: {
                id: updatedAppointment.courseId,
                courseCode: updatedAppointment.courseCode,
                name: updatedAppointment.courseName,
            },
            section: {
                id: updatedAppointment.sectionId,
                section: updatedAppointment.section,
                courseCodeId: updatedAppointment.courseCodeId,
                name: updatedAppointment.sectionName,
            },
            peerMentor: {
                id: updatedAppointment.peerMentorId,
                time: updatedAppointment.time,
                day: updatedAppointment.day,
                name: updatedAppointment.peerMentorName,
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
