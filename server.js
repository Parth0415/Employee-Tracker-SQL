const express = require("express");

const inquirer = require("inquirer");

const consoleTable = require("console.table");

const mysql = require("mysql2");

const app = express();

const PORT = process.env.PORT || 3001;
//using middleware for json included URL
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// creating connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Parth@041597",
  database: "employeetracker_db",
});
// creating questions for menu
const questionsForMenu = [
  {
    name: "option",
    message: "Choose from the following:",
    type: "list",
    choices: [
      "View all employees",
      "Add employees",
      "Update employee role",
      "View all roles",
      "Add role",
      "View all departments",
      "Add department",
      "Quit",
    ],
  },
];

var myDepartments = [];

var roles = [];

var employees = [];
// creating a question array for adding department
const questionForAddDepartment = [
  {
    name: "name",
    message: "What is the name of the department?",
    type: "input",
  },
];
// creating a question array for adding role
const questionForAddRole = [
  { name: "name", message: "What is the name of the role?", type: "input" },
  { name: "salary", message: "What is the salary of the role?", type: "input" },
  {
    name: "department_id",
    message: "Which department does the role belong to?",
    type: "list",
    choices: myDepartments,
  },
];
// creating a question array for adding employees
const questionForAddEmployees = [
  {
    name: "first_name",
    message: "What is the employee's first name?",
    type: "input",
  },
  {
    name: "last_name",
    message: "What is the employee's last name?",
    type: "input",
  },
  {
    name: "role_id",
    message: "What is the employee's role?",
    type: "list",
    choices: roles,
  },
  {
    name: "manager_id",
    message: "Who is the employee's manager?",
    type: "list",
    choices: employees,
  },
];
// creating a question array for updating employee role
const updateEmployeeRole = [
  {
    name: "employee",
    message: "For which employee do you want to update the role?",
    type: "list",
    choices: employees,
  },
  {
    name: "employee_role",
    message: "What role do you want to assign the employee?",
    type: "list",
    choices: roles,
  },
];

async function init() {
  // populating a data inside my department
  db.query(`SELECT * FROM department`, (err, results) => {
    results.forEach((element) => {
      myDepartments.push({ name: element.name, value: element.id });
    });
  });
  // populating a data inside roles
  db.query(`SELECT * FROM role`, (err, results) => {
    results.forEach((element) => {
      roles.push({
        name: element.title,
        value: element.id,
        salary: element.salary,
        department_id: element.department_id,
      });
    });
    //    console.log(roles);
  });
  // populating a data inside employees
  db.query(`SELECT * FROM employee`, (err, results) => {
    results.forEach((element) => {
      employees.push({
        name: element.first_name + " " + element.last_name,
        value: element.id,
        role_id: element.role_id,
        manager_id: element.manager_id,
      });
    });
    // console.log(results);
  });
// prompting the user for the menu and checking for the user selection
  const menuAnswer = await inquirer.prompt(questionsForMenu);
  switch (menuAnswer.option) {
    case "View all employees":
      await viewAllEmployees();
      // console.log("lets view all of employees");
      break;
    case "Add employees":
      await addEmployee();
      break;
    case "Update employee role":
      await updateRole();
      break;
    case "View all roles":
      await viewAllRoles();
      break;
    case "Add role":
      await addRole();
      break;
    case "View all departments":
      await viewAllDepartment();
      break;
    case "Add department":
      await addDepartment();
      break;
    case "Quit":
      process.exit()
      break;
  }
  init();
}

// funtion to view all employees
async function viewAllEmployees() {
  return new Promise((resolve, reject) => {
    // querying all the data from the employee table
    db.query("SELECT * FROM employee", (err, results) => {
      results.forEach((element) => {
        var employeesRole = roles.filter((role) => {
          return role.value == element.role_id;
        });
        element.title = employeesRole[0].name;
        element.salary = employeesRole[0].salary;
// to filter the departments according to the employee
        var employeeDepartment = myDepartments.filter((department) => {
          return department.value == employeesRole[0].department_id;
        });

        element.department = employeeDepartment[0].name;
        delete element.role_id;

        // element.manager_id= employeesRole[0].manager_id
// to filter the manager according to the employee
        var managerData = employees.filter((employee) => {
          return employee.value == element.manager_id;
        });
        //console.log(managerData)
        element.manager =
          managerData[0] == undefined ? "null" : managerData[0].name;
        delete element.manager_id;
      });
      console.table(results);
      if (true) {
        resolve(results);
      } else {
        reject();
      }
    });
  });
}
// funtion to view all roles
async function viewAllRoles() {
  return new Promise((resolve, reject) => {
     // querying all the data from the role table
    db.query("SELECT * FROM role", (err, results) => {
      results.forEach((element) => {
        // to filter the role according to the department
        var departmentOfRole = myDepartments.filter((department) => {
          return department.value == element.department_id;
        });
        element.department = departmentOfRole[0].name;
        delete element.department_id;
      });
      console.table(results);
      if (true) {
        resolve(employees);
      } else {
        reject();
      }
    });
  });
}
// funtion to view all the departments
async function viewAllDepartment() {
  return new Promise((resolve, reject) => {

    db.query("SELECT * FROM department", (err, results) => {
      console.table(results);
      if (true) {
        resolve(results);
      } else {
        reject();
      }
    });
  });
}
// funtion to view all the departments
async function addDepartment() {
  const newDepartmentData = await inquirer.prompt(questionForAddDepartment);
  // console.log(newDepartmentData);
   // adding new data into the department table
  db.query(
    `INSERT INTO department (name) VALUES ('${newDepartmentData.name}')`
  );
}
// funtion to add the role
async function addRole() {
  const newRoleData = await inquirer.prompt(questionForAddRole);
  // console.log(newRoleData);
   // adding new data into the role table
  db.query(
    `INSERT INTO role (title,salary,department_id) VALUES ('${newRoleData.name}','${newRoleData.salary}','${newRoleData.department_id}')`
  );
}
// funtion to add an employee
async function addEmployee() {
  const newEmployeeData = await inquirer.prompt(questionForAddEmployees);
 // adding new data into the employee table
   db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmployeeData.first_name}','${newEmployeeData.last_name}','${newEmployeeData.role_id}','${newEmployeeData.manager_id}')`
  );
}
// funtion to update the employee role
async function updateRole() {
  const updatedEmployeeRole = await inquirer.prompt(updateEmployeeRole);
  // updating data into the role table
  db.query(
    `UPDATE employee SET role_id=${updatedEmployeeRole.employee_role} WHERE id=${updatedEmployeeRole.employee}`
  );
}

app.use((req, res) => {
  res.status(404).end();
});

init();
