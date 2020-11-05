const mysql = require("mysql");
const inquirer = require("inquirer");
// require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Oasis185",
  database: "employeeDB"
});

connection.connect(function (err) {
  if (err) throw err;
  initialPrompt();
});
function initialPrompt() {
    inquirer.prompt({
        message: "what would you like to do?",
        type: "list",
        choices: [
            "View All Employees",
            "View All Departments",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Employee Role",
            "EXIT"
        ],
        name: "choice"
    }).then(answers => {
        console.log(answers.choice);
        switch (answers.choice) {
            case "View All Employees":
                viewEmployees()
                break;

            case "View All Departments":
                viewDepartments()
                break;

            case "Add Employee":
                addEmployee()
                break;

            case "Add Department":
                addDepartment()
                break;

            case "Add Role":
                addRole()
                break;

            case "Update Employee Role":
                updateEmployeeRole();
                break;

            default:
                connection.end()
                break;
        }
    })
}
function addEmployee() {
    console.log("Inserting a new employee.\n");
    inquirer 
      .prompt ([ 
        {
          type: "input", 
          message: "First Name?",
          name: "first_name",
        },
        {
          type: "input", 
          message: "Last Name?",
          name: "last_name"
        },
        {
          type: "list",
          message: "What is the employee's role?",
          name: "role_id", 
          choices: [1,2,3]
        },
        {
          type: "input", 
          message: "Who is their manager?",
          name: "manager_id"
        }
      ])
      .then (function(res){
        const query = connection.query(
          "INSERT INTO employeeDB SET ?", 
         res,
          function(err, res) {
            if (err) throw err;
            console.log( "Employee added!\n");
    
            start (); 
          }
        );    
      })
    }
    function viewEmployees() {
    
      connection.query("SELECT employee.first_name, employee.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees managers ON employees.manager_id = managers.id GROUP BY employees.id",  
      function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
      });
    }
    
    