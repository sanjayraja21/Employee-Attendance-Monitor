const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");


// CREATE ATTENDANCE
const createAttendance = async (req, res) => {
    try {
        const {
            employeeId,
            date,
            checkIn,
            checkOut,
            status
        } = req.body;

        if (!employeeId || !date || !status) {
            return res.status(400).json({
                message:
                    "Employee ID, date and status are required"
            });
        }

        const employee = await Employee.findOne({
            employeeId
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        const existingAttendance =
            await Attendance.findOne({
                employeeId,
                date
            });

        if (existingAttendance) {
            return res.status(409).json({
                message:
                    "Attendance already exists for this date"
            });
        }

        const attendance = await Attendance.create({
            employeeId,
            date,
            checkIn,
            checkOut,
            status
        });

        res.status(201).json({
            message:
                "Attendance created successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL ATTENDANCE
const getAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .sort({ date: -1 });

        res.status(200).json({
            count: attendance.length,
            attendance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET EMPLOYEE ATTENDANCE
const getEmployeeAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({
            employeeId: req.params.employeeId
        }).sort({ date: -1 });

        res.status(200).json({
            employeeId: req.params.employeeId,
            count: attendance.length,
            attendance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE ATTENDANCE
const updateAttendance = async (req, res) => {
    try {
        const attendance =
            await Attendance.findOneAndUpdate(
                {
                    employeeId:
                        req.params.employeeId,

                    date:
                        req.params.date
                },

                req.body,

                {
                    new: true,
                    runValidators: true
                }
            );

        if (!attendance) {
            return res.status(404).json({
                message:
                    "Attendance record not found"
            });
        }

        res.status(200).json({
            message:
                "Attendance updated successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// DELETE ATTENDANCE
const deleteAttendance = async (req, res) => {
    try {
        const attendance =
            await Attendance.findOneAndDelete({
                employeeId:
                    req.params.employeeId,

                date:
                    req.params.date
            });

        if (!attendance) {
            return res.status(404).json({
                message:
                    "Attendance record not found"
            });
        }

        res.status(200).json({
            message:
                "Attendance deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ATTENDANCE PERCENTAGE
const getAttendancePercentage = async (req, res) => {
    try {
        const employeeId =
            req.params.employeeId;

        const records =
            await Attendance.find({
                employeeId
            });

        const totalDays = records.length;

        const presentDays =
            records.filter(
                record =>
                    record.status === "Present"
            ).length;

        const absentDays =
            records.filter(
                record =>
                    record.status === "Absent"
            ).length;

        const lateDays =
            records.filter(
                record =>
                    record.status === "Late"
            ).length;

        const attendancePercentage =
            totalDays === 0
                ? 0
                : ((presentDays + lateDays) /
                    totalDays) * 100;

        res.status(200).json({
            employeeId,
            totalDays,
            presentDays,
            absentDays,
            lateDays,

            attendancePercentage:
                Number(
                    attendancePercentage.toFixed(2)
                )
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createAttendance,
    getAttendance,
    getEmployeeAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendancePercentage
};