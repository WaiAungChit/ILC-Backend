const cron = require("node-cron");
const db = require("../config/db");

// Schedule the task to run every Saturday at midnight
cron.schedule(
    "0 0 * * 6",
    () => {
        console.log("Running the weekly maintenance tasks");

        // Reset peer mentor availability
        const resetQuery = "UPDATE peerMentors SET isAvailable = 0";
        db.query(resetQuery, (err, result) => {
            if (err) {
                console.error(
                    "Error resetting peer mentor availability:",
                    err.stack,
                );
                return;
            }
            console.log(
                "isAvailable column has been reset to 0 for all peer mentors",
            );
        });

        // Delete all rows from the appointments table
        const deleteQuery = "DELETE FROM appointments";
        db.query(deleteQuery, (err, result) => {
            if (err) {
                console.error("Error deleting appointments:", err.stack);
                return;
            }
            console.log(
                "All rows have been deleted from the appointments table",
            );
        });
    },
    { timezone: "Asia/Bangkok" },
);
