const mysql = require("mysql");
const inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");

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