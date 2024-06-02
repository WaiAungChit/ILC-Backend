const db = require("../config/db");

exports.createCourse = async (req, res) => {
    try {
        const { courseCode, name } = req.body;
        if (!courseCode || !name) {
            return res
                .status(400)
                .json({ message: "Both courseCode and name are required" });
        }

        const [existingCourse] = await db.execute(
            "SELECT courseCode FROM courseCodes WHERE courseCode = ?",
            [courseCode],
        );

        if (existingCourse.length > 0) {
            return res
                .status(409)
                .json({ message: "CourseCode already exists" });
        }

        // Insert the new course
        const [result] = await db.execute(
            "INSERT INTO courseCodes (courseCode, name) VALUES (?, ?)",
            [courseCode, name],
        );

        // Retrieve the newly created course
        const [courseRows] = await db.execute(
            "SELECT * FROM courseCodes WHERE id = ?",
            [result.insertId],
        );

        const course = courseRows[0];

        res.status(201).json({ message: "Course created", course });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM courseCodes");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            "SELECT * FROM courseCodes WHERE id = ?",
            [id],
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseCode, name } = req.body;

        if (!courseCode && !name) {
            return res.status(400).json({
                message:
                    "At least one field (courseCode or name) is required for update",
            });
        }

        let sqlQuery = "UPDATE courseCodes SET ";
        const updateValues = [];

        if (courseCode) {
            sqlQuery += "courseCode = ?, ";
            updateValues.push(courseCode);
        }

        if (name) {
            sqlQuery += "name = ?, ";
            updateValues.push(name);
        }

        // Remove the trailing comma and space from the SQL query
        sqlQuery = sqlQuery.slice(0, -2) + " WHERE id = ?";
        updateValues.push(id);

        await db.execute(sqlQuery, updateValues);

        // Retrieve the updated course
        const [updatedCourseRows] = await db.execute(
            "SELECT * FROM courseCodes WHERE id = ?",
            [id],
        );

        if (updatedCourseRows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        const updatedCourse = updatedCourseRows[0];
        res.json({ message: "Course updated", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await db.execute(
            "SELECT * FROM courseCodes WHERE id = ?",
            [id],
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        await db.execute("DELETE FROM courseCodes WHERE id = ?", [id]);
        res.json({ message: "Course deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
