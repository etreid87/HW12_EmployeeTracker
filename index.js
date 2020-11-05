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
    }).then(function(answers) {
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
function viewDepartments() {
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        console.table(res);
        initialPrompt
    });
};
function addDepartment() {
    connection.query()
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department you would like to add?",
                name: "new_department"
            }
        ])
        .then(function (err, res) {
            if (err) throw err;
            connection.query("INSERT INTO departments SET ?",
                {
                    name: res.new_department
                },
                function (err, res) {
                    connection.query("SELECT * FROM departments", function (err, res) {
                        if (err) throw err;
                        initialPrompt();
                    })
                }
            )
        })
}


function addEmployee() {
    console.log("Inserting a new employee");
    inquirer
        .prompt([
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
                choices: [1, 2, 3]
            },
            {
                type: "input",
                message: "Who is their manager?",
                name: "manager_id"
            }
        ])
        .then(function (res) {
            connection.query("INSERT INTO employeeDB SET ?", res, function (err, res) {
                    if (err) throw err;
                    console.log("Employee added\n");

                    initialPrompt();
                }
            );
        })
}
function viewEmployees() {

    connection.query("SELECT employee.first_name, employee.last_name, roles.title AS \"role\", managers.first_name AS \"manager\" FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees managers ON employees.manager_id = managers.id GROUP BY employees.id",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            initialPrompt();
        });
}
function addRole() {
    let departments = [];
    connection.query("SELECT * FROM departments",
        function (err, res) {
            if (err) throw err;
            for (let i = 0; i < res.length; i++) {
                res[i].first_name + res[i].last_name
                departments.push({ name: res[i].name, value: res[i].id });
            }
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "title",
                        message: "What role would you like to add?"
                    }
                ])
                .then(function (res) {
                  connection.query("INSERT INTO roles SET ?",{
                            title: res.title,
                        },
                        function (err, res) {
                            if (err) throw err;

                            initialPrompt();
                        }
                    )
                })
        })
}


function updateEmployeeRole() {

    connection.query("SELECT first_name, last_name, id FROM employees",
        function (err, res) {
            if (err) throw err;
            let employees = res.map(employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id }))

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employeeName",
                        message: "Which employee's role would you like to update?",
                        choices: employees
                    },
                    {
                        type: "input",
                        name: "role",
                        message: "What is your new role?"
                    }
                ])
                .then(function (res) {
                    connection.query(`UPDATE employees SET role_id = ${res.role} WHERE id = ${res.employeeName}`,
                        function (err, res) {
                            initialPrompt()
                        }
                    );
                })
        });
    };
