const inquirer = require("inquirer");
const employeePrompt = require("./employeePrompt");
const rolePrompt = require("./rolePrompt");
const departmentPrompt = require("./departmentPrompt");

function mainMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "Choose:",
            name: "userChoice",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View All Roles",
                "Add Role",
                "Edit Role",
                "View All Departments",
                "Add Department",
                "EXIT APPLICATION"
            ]
        }
    ]).then(function (response) {
        switch (response.userChoice) {
            case "View All Employees":
                employeePrompt.viewEmployees("employee");
                break;

            case "View All Employees By Department":
                employeePrompt.viewEmployees("department");
                break;

            case "View All Employees By Manager":
                employeePrompt.viewEmployees("manager");
                break;

            case "Add Employee":
                employeePrompt.addEmployee();
                break;

            case "Remove Employee":
                employeePrompt.removeEmployee();
                break;

            case "Update Employee Role":
                employeePrompt.updateEmployeeRole();
                break;

            case "Update Employee Manager":
                employeePrompt.updateEmployeeManager();
                break;

            case "View All Roles":
                rolePrompt.viewRoles();
                break;

            case "Add Role":
                rolePrompt.addRole();
                break;

            case "Edit Role":
                rolePrompt.editRole();
                break;

            case "View All Departments":
                departmentPrompt.viewDepartments();
                break;

            case "Add Department":
                departmentPrompt.addDepartment();
                break;

            default:
                console.log("Application terminated!");
                process.exit();
        }
    });
}

exports.mainMenu = mainMenu;