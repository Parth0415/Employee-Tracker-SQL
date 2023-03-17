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


const myDepartments= [];

const roles= [];

const employees= [];

const questionForAddDepartment = [
    { name: "name", message: "What is the name of the department?", type: "input" },
];

const questionForAddRole = [
    { name: "name", message: "What is the name of the role?", type: "input" },
    { name: "name", message: "What is the salary of the role?", type: "input" },
    { name: "name", message: "Which department does the role belong to?", type: "list", choices: myDepartments}
];

const questionForAddEmployees = [
    { name: "name", message: "What is the employee's first name?", type: "input" },
    { name: "name", message: "What is the employee's last name?", type: "input" },
    { name: "name", message: "What is the employee's role?", type: "list", choices: roles},
    { name: "name", message: "Who is the employee's manager?", type: "list", choices: employees}
]

async function init(){
    const menuAnswer = await inquirer.prompt(questionsForMenu)
    console.log(menuAnswer)
    switch(menuAnswer.option){
        case "View all employees":
            viewAllEmployees();
            console.log("lets view all of employees")
            break;
        case "Add employees":
            console.log("adding employees")
            break;
        case "Update employee role":
            console.log("Role of employees updated")
            break;
        case "View all roles":
            viewAllRoles();
            console.log("lets view all of roles")
            break;
        case "Add roles":
            console.log("role added")
            break;
        case "View all departments":
            viewAllDepartment();
            console.log("lets view all of departhments")
            break;
        case "Add department":
            console.log("department added")
            break;
        case "Quit":
            console.log("exit")
            break;
    }



}

function viewAllEmployees(){
    db.query("SELECT * FROM employee", (err, results)=>{
        console.table(results)
    })
};

function viewAllRoles(){
    db.query("SELECT * FROM role", (err, results)=>{
        console.table(results)
    })
};

function viewAllDepartment(){
    db.query("SELECT * FROM department", (err, results)=>{
        console.table(results)
    })
};







app.use((req, res) => {
  res.status(404).end();
});


init()