const express = require("express");

const inquirer = require("inquirer");

const consoleTable = require("console.table");

const mysql = require("mysql2");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Parth@041597",
  database: "employeetracker_db",
});

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
      "Quit"
    ],
  },
];

const questionForAddDepartment = [
    { name: "name", message: "What is the name of the department?", type: "input" },
];

const myDepartments= []


const questionForAddRole = [
    { name: "name", message: "What is the name of the role?", type: "input" },
    { name: "name", message: "What is the salary of the role?", type: "input" },
    { name: "name", message: "Which department does the role belong to?", type: "list", choices: myDepartments}
];

app.use((req, res) => {
  res.status(404).end();
});
