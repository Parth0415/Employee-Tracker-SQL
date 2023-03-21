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
    { name: "salary", message: "What is the salary of the role?", type: "input" },
    { name: "department_id", message: "Which department does the role belong to?", type: "list", choices: myDepartments}
];

const questionForAddEmployees = [
    { name: "first_name", message: "What is the employee's first name?", type: "input" },
    { name: "last_name", message: "What is the employee's last name?", type: "input" },
    { name: "role_id", message: "What is the employee's role?", type: "list", choices: roles},
    { name: "manager_id", message: "Who is the employee's manager?", type: "list", choices: employees}
]

async function init(){
    db.query(`SELECT * FROM department`, (err, results)=>{
        results.forEach((element)=>{
            myDepartments.push({name: element.name, value: element.id})
        })
    })

    db.query(`SELECT * FROM role`, (err,results)=>{
        results.forEach((element)=>{
            roles.push({name: element.title, value: element.id, salary: element.salary, department_id: element.department_id})
        })
    //    console.log(roles);
    } )

    db.query(`SELECT * FROM employee`, (err,results)=>{
        results.forEach((element)=>{
            employees.push({name: element.first_name +" "+element.last_name, value:element.id, role_id: element.role_id, manager_id:element.manager_id})
            
        })
        // console.log(results);
    })
       
   

    const menuAnswer = await inquirer.prompt(questionsForMenu)
    switch(menuAnswer.option){
        case "View all employees":
            viewAllEmployees();
            console.log("lets view all of employees")
            break;
        case "Add employees":
           await addEmployee();
            break;
        case "Update employee role":
            console.log("Role of employees updated")
            break;
        case "View all roles":
            viewAllRoles();
            console.log("lets view all of roles")
            break;
        case "Add role":
            await addRole();
            break;
        case "View all departments":
            viewAllDepartment();
            console.log("lets view all of departhments")
            break;
        case "Add department":
            await addDepartment();
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
      //  console.log(results);
       
        console.table(results)
    })
};

function viewAllDepartment(){
    db.query("SELECT * FROM department", (err, results)=>{
        console.table(results)
    })
};

async function addDepartment(){
    const newDepartmentData = await inquirer.prompt(questionForAddDepartment)
    console.log(newDepartmentData)
    db.query(`INSERT INTO department (name) VALUES ('${newDepartmentData.name}')`);
}

async function addRole(){
    const newRoleData = await inquirer.prompt(questionForAddRole)
    console.log(newRoleData)
   db.query(`INSERT INTO role (title,salary,department_id) VALUES ('${newRoleData.name}','${newRoleData.salary}','${newRoleData.department_id}')`);
}

async function addEmployee(){
    const newEmployeeData = await inquirer.prompt(questionForAddEmployees)
    console.log(newEmployeeData)
     db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmployeeData.first_name}','${newEmployeeData.last_name}','${newEmployeeData.role_id}','${newEmployeeData.manager_id}')`);
}



app.use((req, res) => {
  res.status(404).end();
});


init()