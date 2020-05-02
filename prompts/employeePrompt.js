const mainPrompt = require("./mainPrompt");
const inquirer = require("inquirer");
const cTable = require("console.table");
const server = require("../server");

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter employee name (first last):",
            name: "employeeName"
        },

        {
            type: "number",
            message: "Enter role id: ",
            name: "employeeRole"
        },

        {
            type: "confirm",
            message: "Does this employee have a manager?:",
            name: "hasManager"
        },

        {
            type: "number",
            message: "Enter manager id:",
            name: "managerId",
            when: function (response) {
                return response.hasManager;
            }
        }
    ]).then(function (response) {
        response.employeeName = response.employeeName.split(" ");
        server.connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: response.employeeName[0],
                last_name: response.employeeName[1],
                role_id: response.employeeRole,
                manager_id: response.managerId
            },
            function (err, res) {
                if (err) throw err;
                console.log();
                console.log("New employee added!");
                console.log();
                mainPrompt.mainMenu();
            }
        );
    });
}

function viewEmployees(sortBy) {
    var queryName =
        "(SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, " +
        "role.title AS role, role.salary, department.name AS department_name FROM (" +
        "(employee INNER JOIN role ON employee.role_id = role.id) " +
        "INNER JOIN department ON role.department_id = department.id)) ";

    switch (sortBy.toLowerCase()) {
        case "employee":
            queryName += "ORDER BY employee.id;";
            break;

        case "department":
            queryName += "ORDER BY department.id";
            break;

        case "manager":
            queryName += "ORDER BY employee.manager_id";
            break;
    }

    server.connection.query(queryName, function (err, res) {
        if (err) throw err;
        console.log();
        console.table(res);
        mainPrompt.mainMenu();
    });
}

function updateEmployeeRole() {
    inquirer.prompt([
        {
            type: "number",
            message: "Enter employee id to update employee's role id:",
            name: "employeeId"
        },

        {
            type: "number",
            message: "Enter new role id for selected employee:",
            name: "employeeRoleId"
        }
    ]).then(function (response) {
        server.connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
                { role_id: response.employeeRoleId },
                { id: response.employeeId }
            ],
            function (err, res) {
                if (err) throw err;
                console.log();
                console.log("Employee role updated!");
                console.log();
                mainPrompt.mainMenu();
            }
        );
    });
}

function updateEmployeeManager() {
    inquirer.prompt([
        {
            type: "number",
            message: "Enter employee id to update employee's manager id:",
            name: "employeeId"
        },

        {
            type: "number",
            message: "Enter new manager id for selected employee:",
            name: "employeeManagerId"
        }
    ]).then(function (response) {
        server.connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
                { manager_id: response.employeeManagerId },
                { id: response.employeeId }
            ],
            function (err, res) {
                if (err) throw err;
                console.log();
                console.log("Updated employee's manager id!");
                console.log();
                mainPrompt.mainMenu();
            }
        )
    });
}

function removeEmployee() {
    inquirer.prompt([
        {
            type: "number",
            message: "Enter id of employee to remove:",
            name: "removeEmployeeId"
        }
    ]).then(function (response) {
        server.connection.query(
            "DELETE FROM employee WHERE ?",
            {
                id: response.removeEmployeeId
            },
            function (err, res) {
                if (err) throw err;
                console.log();
                console.log(res.changedRows + "Employee deleted!");
                console.log();
                mainPrompt.mainMenu();
            });
    });
}

module.exports = {
    addEmployee, viewEmployees, updateEmployeeRole,
    updateEmployeeManager, removeEmployee
}