const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        employeeId: {
            type: String,
            required: true
        },

        date: {
            type: String,
            required: true
        },

        checkIn: {
            type: String,
            default: ""
        },

        checkOut: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["Present", "Absent", "Late"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Attendance", attendanceSchema);