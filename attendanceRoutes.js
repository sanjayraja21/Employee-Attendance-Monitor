const express = require("express");

const {
    createAttendance,
    getAttendance,
    getEmployeeAttendance,
    updateAttendance,
    deleteAttendance,
    getAttendancePercentage
} = require("../controllers/attendanceController");

const router = express.Router();

router.post("/", createAttendance);

router.get("/", getAttendance);

router.get(
    "/percentage/:employeeId",
    getAttendancePercentage
);

router.get(
    "/employee/:employeeId",
    getEmployeeAttendance
);

router.put(
    "/:employeeId/:date",
    updateAttendance
);

router.delete(
    "/:employeeId/:date",
    deleteAttendance
);

module.exports = router;