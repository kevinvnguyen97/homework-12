var express = require("express");
var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var app = express();

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "employee_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  mainMenu();
});

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
        "Add Departments",
        "EXIT APPLICATION"
      ]
    }
  ]).then(function(response) {
    switch(response.userChoice) {
      case "View All Employees":
        viewEmployees("employee");
        break;

      case "View All Employees By Department":
        viewEmployees("department");
        break;

      case "View All Employees By Manager":
        viewEmployees("manager");
        break;

      case "Add Employee":
        addEmployee();
        break;

      case "Remove Employee":
        removeEmployee();
        break;

      case "Update Employee Role":
        //updateEmployee();
        break;
      
      case "Update Employee Manager":
        //updateManager();
        break;

      case "View All Roles":
        viewRoles();
        break;

      case "Add Role":
        addRole();
        break;

      case "Edit Role":
        break;
      
      case "View All Departments":
        viewDepartments();
        break;

      default:
        throw new Error("Application terminated.");
        break;
    }
  });
}

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
      when: function(response) {
        return response.hasManager;
      }
    }
  ]).then(function(response) {
    response.employeeName = response.employeeName.split(" ");
    connection.query(
      "INSERT INTO employee SET ?",
      {
        first_name: response.employeeName[0],
        last_name: response.employeeName[1],
        role_id: response.employeeRole,
        manager_id: response.managerId
      },
      function(err, res) {
        if(err) throw err;
        console.log();
        console.log("New employee added!");
        console.log();
        mainMenu();
      }
    );
  });
}

function viewEmployees(sortBy) {
  var queryName =
    "(SELECT employee.*, role.title, role.salary, department.name FROM (" +
    "(employee INNER JOIN role ON employee.role_id = role.id) " +
    "INNER JOIN department ON role.department_id = department.id)) ";

  switch(sortBy.toLowerCase()) {
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

  connection.query(queryName, function(err, res) {
    if (err) throw err;
    console.log();
    console.table(res);
    mainMenu();
  });
}

function removeEmployee() {
  inquirer.prompt([
    {
      type: "number",
      message: "Enter id of employee to remove:",
      name: "removeEmployeeId"
    }
  ]).then(function(response) {
    connection.query(
      "DELETE FROM employee WHERE ?",
      {
        id: response.removeEmployeeId
      },
      function(err, res) {
        if (err) throw err;
        console.log();
        console.log("Employee deleted!");
        console.log();
        mainMenu();
      });
  });
}

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
  ]).then(function(response) {
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: response.roleName,
        salary: response.roleSalary,
        department_id: response.departmentId
      },
      function(err, res) {
        if (err) throw err;
        console.log();
        console.log("New role added!");
        console.log();
        mainMenu();
      }
    );
  });
}

function viewRoles() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}

// function editRole() {

// }

// function addDepartment() {
//   inquirer.prompt([
//     {
//       type: "input",
//       message: "Enter department name:",
//       name: "departmentName"
//     }
//   ]).then(function(response) {
//     addDepartment(response.name);
//   });
// }

function viewDepartments() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}
// function updateProduct() {
//   console.log("Updating all Rocky Road quantities...\n");
//   var query = connection.query(
//     "UPDATE products SET ? WHERE ?",
//     [
//       {
//         quantity: 100
//       },
//       {
//         flavor: "Rocky Road"
//       }
//     ],
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products updated!\n");
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }

// function deleteProduct() {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM products WHERE ?",
//     {
//       flavor: "strawberry"
//     },
//     function(err, res) {
//       if (err) throw err;
//       console.log(res.affectedRows + " products deleted!\n");
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// }

// function readProducts() {
//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// }
