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
    server.connection.query("(SELECT role.id, role.title, role.salary, department.name AS department FROM (role LEFT JOIN department ON role.department_id = department.id))", function (err, res) {
        if (err) throw err;
        console.log();
        console.table(res);
        mainPrompt.mainMenu();
    });
}

function updateRole() {
    server.connection.query("SELECT role.title FROM role", function(err, res) {
        if (err) throw err;
        console.log(res);

        var roleChoices = [];
        res.forEach(roleObj => roleChoices.push(roleObj.title));

        inquirer.prompt([
            {
                type: "list",
                message: "Select role to update:",
                name: "roleTitle",
                choices: roleChoices
            },
    
            {
                type: "confirm",
                message: "Update role name?:",
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
                message: "Update role salary?:",
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
                message: "Update role department id?:",
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
    
            if (response.changeRoleName) updateCols["title"] = response.newRoleName;
            if (response.changeRoleSalary) updateCols["salary"] = response.newRoleSalary;
            if (response.changeRoleDepartmentId) updateCols["department_id"] = response.newRoleDepartmentId;
            if (!(response.changeRoleName && response.changeRoleSalary && response.changeRoleDepartmentId)) {
                console.log();
                console.log("No changes made to this role!");
                console.log();
                mainPrompt.mainMenu();
            }
    
            server.connection.query(
                "UPDATE role SET ? WHERE ?",
                [updateCols, { title: response.roleTitle }],
                function (err, res) {
                    if (err) throw err;
                    console.log();
                    console.log("Updated role!");
                    console.log();
                    mainPrompt.mainMenu();
                }
            );
        });
    });
}

module.exports = {addRole, viewRoles, updateRole}