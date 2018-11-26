const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

var connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "M!ami2406",
  database: "bamazon_db"
});

connection.connect(function(error) {
  if (error) {
    throw error;
  }
  inquirer
    .prompt([
      {
        name: "supervisorSelection",
        type: "rawlist",
        message: "Please select what you would like to do.",
        choices: ["View Product Sales by Department", "Create New Department"]
      }
    ])
    .then(function(answer) {
      if (answer.supervisorSelection === "View Product Sales by Department") {
        viewDepartment();
      } else if (answer.supervisorSelection === "Create New Department") {
        createDepartment();
      }
    });
});

const viewDepartment = () => {
  connection.query(
    "SELECT d.name, SUM(p.product_sales) AS sales, SUM(p.product_sales) - d.overhead AS profit FROM departments AS d JOIN products AS p ON (d.name = p.department_name) GROUP BY d.id",
    function(error, result) {
      if (error) {
        throw error;
      }
      console.table(result);
    }
  );
};

const createDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "What new department would you like to create?"
      },
      {
        name: "overhead",
        type: "input",
        message: "What is the overhead of this new department?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return "Invalid Entry; please enter a number";
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO departments SET ?",
        [
          {
            name: answer.department,
            overhead: answer.overhead
          }
        ],
        function(error) {
          if (error) {
            throw error;
          }
          console.log("New department successfully added");
        }
      );
    });
};
