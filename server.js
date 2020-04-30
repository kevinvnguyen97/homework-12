var express = require("express");
var mysql = require("mysql");
var inquirer = require("inquirer");

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
  createProduct();
});

function mainMenu() {
  inquirer.prompt([
    {
      type: "list",
      message: "Choose:",
      name: "userChoice",
      choices: [
        "Employee",
        "Role",
        "Department"
      ]
    }
  ]).then(function(response) {
    switch(response.userChoice) {
      case "Employee":
        employeePrompt();
        break;

      case "Role":
        rolePrompt();
        break;

      case "Department":
        departmentPrompt();
        break;

      default:
        break;
    }
  });
}

function employeePrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "Choose actions:",
      name: "userChoice",
      choices: [
        "Add employee",
        "View employee",
        "Edit employee role"
      ]
    }
  ]).then(function(response) {
    switch(response.userChoice) {
      case "Add employee":
        addEmployee();
        break;
      
      case "View employee":
        viewEmployee();
        break;

      case "Edit employee role":
        editEmployeeRole();
        break;

      default:
        break;
    }
  });
}

function viewEmployee() {

}

function addEmployee() {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter employee name (first last):",
      name: "employeeName"
    },

    {
      type: "input",
      message: "Enter role: ",
      name: "employeeRole"
    },

    {
      type: "confirm",
      message: "Does this employee have a manager?:",
      name: "hasManager"
    },

    {
      type: "input",
      message: "Enter manager name (first last):",
      name: "managerName",
      when: function(response) {
        return response.hasManager;
      }
    }
  ]).then(function(response) {
    
  });
}

function rolePrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "Choose actions:",
      name: "userChoice",
      choices: [
        "Add role",
        "View role",
        "Edit role"
      ]
    }
  ]).then(function(response) {
    switch(response.userChoice) {
      case "Add role":
        addRole();
        break;

      case "View role":
        viewRole();
        break;

      case "Edit role":
        editRole();
        break;

      default:
        break;
    }
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
      message: "Enter department:",
      name: "roleDepartment"
    }
  ]).then(function(response) {
    
  });
}

function viewRole() {

}

function editRole() {

}

function departmentPrompt() {
  inquirer.prompt([
    {
      type: "list",
      message: "Choose:",
      name: "userChoice",
      choices: [
        "Add department",
        "View departments"
      ]
    }
  ]).then(function(response) {
    switch(response.choice) {
      case "Add department":
        addDepartment();
        break;
      case "View departments":
        viewDepartments();
        break;
      default:
        break;
    }
  });
}

function addDepartment() {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter department name:",
      name: "departmentName"
    }
  ]).then(function(response) {
    addDepartment(response.name);
  });
}

function viewDepartments() {
  
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
