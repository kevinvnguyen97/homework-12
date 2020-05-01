var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

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
        "Add Department",
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
        updateEmployeeRole();
        break;
      
      case "Update Employee Manager":
        updateEmployeeManager();
        break;

      case "View All Roles":
        viewRoles();
        break;

      case "Add Role":
        addRole();
        break;

      case "Edit Role":
        editRole();
        break;
      
      case "View All Departments":
        viewDepartments();
        break;
      
      case "Add Department":
        addDepartment();
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
  ]).then(function(response) {
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {role_id: response.employeeRoleId},
        {id: response.employeeId}
      ],
      function(err, res) {
        if (err) throw err;
        console.log();
        console.log("Employee role updated!");
        console.log();
        mainMenu();
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
  ]).then(function(response) {
    connection.query(
      "UPDATE employee SET ? WHERE ?",
      [
        {manager_id: response.employeeManagerId},
        {id: response.employeeId}
      ],
      function(err, res) {
        if (err) throw err;
        console.log();
        console.log("Updated employee's manager id!");
        console.log();
        mainMenu();
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
  ]).then(function(response) {
    connection.query(
      "DELETE FROM employee WHERE ?",
      {
        id: response.removeEmployeeId
      },
      function(err, res) {
        if (err) throw err;
        console.log();
        console.log(res.changedRows + "Employee deleted!");
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
      when: function(response) {
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
      when: function(response) {
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
      when: function(response) {
        return response.changeRoleDepartmentId;
      }
    }
  ]).then(function(response) {
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

    connection.query(
      "UPDATE role SET ? WHERE ?",
      [
        updateCols,
        {id: response.roleId}
      ],
      function(err, res) {
        if (err) throw err;
        console.log();
        console.log("Updated role!");
        console.log();
        mainMenu();
      });
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
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: response.departmentName
      },
      function(err, res) {
        if (err) throw err;
        console.log();
        console.log("New department added!");
        console.log();
        mainMenu();
      });
  });
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    console.table(res);
    mainMenu();
  });
}