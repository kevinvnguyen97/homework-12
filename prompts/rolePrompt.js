const mainPrompt = require("./mainPrompt");
const inquirer = require("inquirer");
const cTable = require("console.table");
const server = require("../server");

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter role name:",
            name: "roleName"
        },

        {
            type: "number",
            message: "Enter role salary:",
            name: "roleSalary"
        },

        {
            type: "input",
            message: "Enter department id:",
            name: "departmentId"
        }
    ]).then(function (response) {
        server.connection.query(
            "INSERT INTO role SET ?",
            {
                title: response.roleName,
                salary: response.roleSalary,
                department_id: response.departmentId
            },
            function (err, res) {
                if (err) throw err;
                console.log();
                console.log("New role added!");
                console.log();
                mainPrompt.mainMenu();
            }
        );
    });
}

function viewRoles() {
    server.connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainPrompt.mainMenu();
    });
}

function editRole() {
    inquirer.prompt([
        {
            type: "number",
            message: "Enter role id to edit:",
            name: "roleId"
        },

        {
            type: "confirm",
            message: "Edit role name?:",
            name: "changeRoleName"
        },

        {
            type: "input",
            message: "Enter new role name:",
            name: "newRoleName",
            when: function (response) {
                return response.changeRoleName;
            }
        },

        {
            type: "confirm",
            message: "Edit role salary?:",
            name: "changeRoleSalary"
        },

        {
            type: "number",
            message: "Enter new role salary:",
            name: "newRoleSalary",
            when: function (response) {
                return response.changeRoleSalary;
            }
        },

        {
            type: "confirm",
            message: "Edit role department id?:",
            name: "changeRoleDepartmentId"
        },

        {
            type: "input",
            message: "Enter new role department id:",
            name: "newRoleDepartmentId",
            when: function (response) {
                return response.changeRoleDepartmentId;
            }
        }
    ]).then(function (response) {
        var updateCols = {};

        if (response.changeRoleName) {
            updateCols["title"] = response.newRoleName;
            console.log(updateCols);
        }

        if (response.changeRoleSalary) {
            updateCols["salary"] = response.newRoleSalary;
            console.log(updateCols);
        }

        if (response.changeRoleDepartmentId) {
            updateCols["department_id"] = response.newRoleDepartmentId;
            console.log(updateCols);
        }

        server.connection.query(
            "UPDATE role SET ? WHERE ?",
            [
                updateCols,
                { id: response.roleId }
            ],
            function (err, res) {
                if (err) throw err;
                console.log();
                console.log("Updated role!");
                console.log();
                mainPrompt.mainMenu();
            });
    });
}

module.exports = {
    addRole: addRole,
    viewRoles: viewRoles,
    editRole: editRole,
}