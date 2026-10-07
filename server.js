const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Employee Schema
const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    department: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model("Employee", employeeSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
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
        required: true
    }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);


// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ===============================
// TEST API
// ===============================

app.get("/api", (req, res) => {
    res.json({
        message: "Employee Attendance API is working"
    });
});


// ===============================
// ADD EMPLOYEE
// ===============================

app.post("/api/employees", async (req, res) => {

    try {

        const { employeeId, name, email, department } = req.body;

        if (!employeeId || !name || !email || !department) {
            return res.status(400).json({
                message: "Please fill all employee fields"
            });
        }

        const existingEmployee = await Employee.findOne({
            employeeId: employeeId
        });

        if (existingEmployee) {
            return res.status(400).json({
                message: "Employee already exists"
            });
        }

        const employee = new Employee({
            employeeId,
            name,
            email,
            department
        });

        await employee.save();

        res.json({
            message: "Employee added successfully",
            employee
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// GET EMPLOYEES
// ===============================

app.get("/api/employees", async (req, res) => {

    try {

        const employees = await Employee.find();

        res.json(employees);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// DELETE EMPLOYEE
// ===============================

app.delete("/api/employees/:employeeId", async (req, res) => {

    try {

        const employeeId = req.params.employeeId;

        await Employee.deleteOne({
            employeeId: employeeId
        });

        await Attendance.deleteMany({
            employeeId: employeeId
        });

        res.json({
            message: "Employee deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// ADD ATTENDANCE
// ===============================

app.post("/api/attendance", async (req, res) => {

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
                message: "Employee ID, date and status are required"
            });
        }

        // Check employee
        const employee = await Employee.findOne({
            employeeId: employeeId
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        // Check duplicate attendance
        const existingAttendance = await Attendance.findOne({
            employeeId: employeeId,
            date: date
        });

        if (existingAttendance) {
            return res.status(400).json({
                message: "Attendance already exists for this date"
            });
        }

        const attendance = new Attendance({
            employeeId,
            date,
            checkIn,
            checkOut,
            status
        });

        await attendance.save();

        res.json({
            message: "Attendance added successfully",
            attendance
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// GET ATTENDANCE
// ===============================

app.get("/api/attendance", async (req, res) => {

    try {

        const attendance = await Attendance.find();

        res.json(attendance);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ===============================
// CONNECT MONGODB
// ===============================

mongoose.connect(MONGO_URI)
    .then(() => {

        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

    });