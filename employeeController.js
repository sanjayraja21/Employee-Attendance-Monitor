const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");


// CREATE EMPLOYEE
const createEmployee = async (req, res) => {
    try {
        const {
            employeeId,
            name,
            email,
            department
        } = req.body;

        if (!employeeId || !name || !email || !department) {
            return res.status(400).json({
                message: "All employee fields are required"
            });
        }

        const existingEmployee = await Employee.findOne({
            $or: [
                { employeeId },
                { email }
            ]
        });

        if (existingEmployee) {
            return res.status(409).json({
                message: "Employee ID or email already exists"
            });
        }

        const employee = await Employee.create({
            employeeId,
            name,
            email,
            department
        });

        res.status(201).json({
            message: "Employee created successfully",
            employee
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ALL EMPLOYEES
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: employees.length,
            employees
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET ONE EMPLOYEE
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findOne({
            employeeId: req.params.employeeId
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            employee
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// UPDATE EMPLOYEE
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOneAndUpdate(
            {
                employeeId: req.params.employeeId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// DELETE EMPLOYEE
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findOneAndDelete({
            employeeId: req.params.employeeId
        });

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            });
        }

        await Attendance.deleteMany({
            employeeId: req.params.employeeId
        });

        res.status(200).json({
            message:
                "Employee and attendance records deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};