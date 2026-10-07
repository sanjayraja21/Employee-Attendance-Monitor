const express = require("express");

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require("../controllers/employeeController");

const router = express.Router();

router.post("/", createEmployee);

router.get("/", getEmployees);

router.get(
    "/:employeeId",
    getEmployeeById
);

router.put(
    "/:employeeId",
    updateEmployee
);

router.delete(
    "/:employeeId",
    deleteEmployee
);

module.exports = router;