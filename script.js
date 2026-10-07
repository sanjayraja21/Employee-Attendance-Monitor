// ===============================
// LOAD EMPLOYEES
// ===============================

async function loadEmployees() {

    try {

        const response = await fetch("/api/employees");

        const employees = await response.json();

        const table =
            document.getElementById("employeeTable");

        table.innerHTML = "";

        employees.forEach(employee => {

            table.innerHTML += `

                <tr>

                    <td>${employee.employeeId}</td>

                    <td>${employee.name}</td>

                    <td>${employee.email}</td>

                    <td>${employee.department}</td>

                    <td>

                        <button
                            onclick="deleteEmployee('${employee.employeeId}')">
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });

    } catch (error) {

        alert("Server connection error");

    }
}


// ===============================
// ADD EMPLOYEE
// ===============================

async function addEmployee() {

    const employeeId =
        document.getElementById("employeeId").value;

    const name =
        document.getElementById("employeeName").value;

    const email =
        document.getElementById("employeeEmail").value;

    const department =
        document.getElementById("department").value;


    try {

        const response = await fetch(
            "/api/employees",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    employeeId,
                    name,
                    email,
                    department

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert("Employee added successfully");


        document.getElementById("employeeId").value = "";

        document.getElementById("employeeName").value = "";

        document.getElementById("employeeEmail").value = "";

        document.getElementById("department").value = "";


        loadEmployees();

    } catch (error) {

        alert("Server connection error");

        console.error(error);

    }

}


// ===============================
// DELETE EMPLOYEE
// ===============================

async function deleteEmployee(employeeId) {

    const confirmDelete =
        confirm("Delete this employee?");

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `/api/employees/${employeeId}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();

        alert(data.message);

        loadEmployees();

        loadAttendance();

    } catch (error) {

        alert("Server connection error");

    }

}


// ===============================
// ADD ATTENDANCE
// ===============================

async function addAttendance() {

    const employeeId =
        document.getElementById(
            "attendanceEmployeeId"
        ).value;

    const date =
        document.getElementById(
            "attendanceDate"
        ).value;

    const checkIn =
        document.getElementById(
            "checkIn"
        ).value;

    const checkOut =
        document.getElementById(
            "checkOut"
        ).value;

    const status =
        document.getElementById(
            "status"
        ).value;


    try {

        const response = await fetch(
            "/api/attendance",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    employeeId,
                    date,
                    checkIn,
                    checkOut,
                    status

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);

            return;

        }


        alert("Attendance added successfully");


        document.getElementById(
            "attendanceEmployeeId"
        ).value = "";

        document.getElementById(
            "checkIn"
        ).value = "";

        document.getElementById(
            "checkOut"
        ).value = "";

        document.getElementById(
            "status"
        ).value = "";


        loadAttendance();

    } catch (error) {

        alert("Server connection error");

    }

}


// ===============================
// LOAD ATTENDANCE
// ===============================

async function loadAttendance() {

    try {

        const response =
            await fetch("/api/attendance");

        const attendance =
            await response.json();


        const table =
            document.getElementById(
                "attendanceTable"
            );


        table.innerHTML = "";


        attendance.forEach(record => {

            table.innerHTML += `

                <tr>

                    <td>${record.employeeId}</td>

                    <td>${record.date}</td>

                    <td>${record.checkIn}</td>

                    <td>${record.checkOut}</td>

                    <td>${record.status}</td>

                </tr>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}


// ===============================
// LOAD DATA WHEN PAGE OPENS
// ===============================

loadEmployees();

loadAttendance();