const mainPrompt = require("./mainPrompt");
const inquirer = require("inquirer");
const cTable = require("console.table");
const server = require("../server");

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter department name:",
            name: "departmentName"
        }
    ]).then(function (response) {
        server.connection.query(
            "INSERT INTO department SET ?",
            {
                name: response.departmentName
            },
            function (err, res) {
                if (err) throw err;
                console.log();
                console.log("New department added!");
                console.log();
                mainPrompt.mainMenu();
            });
    });
}

function viewDepartments() {
    server.connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        mainPrompt.mainMenu();
    });
}

module.exports = {
    addDepartment, viewDepartments
}