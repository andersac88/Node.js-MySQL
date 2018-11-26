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
  bamazonAll();
});

const bamazonAll = () => {
  inquirer
    .prompt([
      {
        name: "role",
        type: "rawlist",
        message: "Are you a Customer, Manager or Supervisor?",
        choices: ["Customer", "Manager", "Supervisor"]
      }
    ])
    .then(function(answer) {
      if (answer.role === "Customer") {
        bamazonCustomer();
      } else if (answer.role === "Manager") {
        bamazonManager();
      } else if (answer.role === "Supervisor") {
        bamazonSupervisor();
      }
    });
};

const bamazonCustomer = () => {
  connection.query("SELECT * FROM products", function(error, result) {
    if (error) {
      throw error;
    }
    console.table(result);
    inquirer
      .prompt([
        {
          type: "rawlist",
          message:
            "Please select the ID of the item you would like to purchase.",
          choices: result.map(item => item.id.toString()),
          name: "idSelector"
        },
        {
          name: "howMany",
          message: "How many units would you like to purchase of said product?",
          type: "input",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return "Invalid Entry; please enter a number";
          }
        }
      ])
      .then(function(answer) {
        let userChoice;
        for (var i = 0; i < result.length; i++) {
          if (result[i].id == answer.idSelector) {
            userChoice = result[i];
          }
        }

        if (userChoice.stock_quantity > parseInt(answer.howMany)) {
          let newQuantity = userChoice.stock_quantity - answer.howMany;
          let amountSpent = answer.howMany * userChoice.price;
          let productSale = userChoice.product_sales + amountSpent;

          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newQuantity,
                product_sales: productSale
              },
              {
                id: userChoice.id
              }
            ],
            function(error) {
              if (error) {
                throw error;
              }
              console.log(`Purchase Successful, your total is $${amountSpent}`);
              bamazonAll();
            }
          );
        } else {
          console.log("Insufficient quantity!");
          bamazonAll();
        }
      });
  });
};

const bamazonManager = () => {
  inquirer
    .prompt([
      {
        name: "managerSelection",
        type: "rawlist",
        message: "Please select what you would like to do.",
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product"
        ]
      }
    ])
    .then(function(answer) {
      if (answer.managerSelection === "View Products for Sale") {
        viewProducts();
      } else if (answer.managerSelection === "View Low Inventory") {
        lowInventory();
      } else if (answer.managerSelection === "Add to Inventory") {
        addInventory();
      } else if (answer.managerSelection === "Add New Product") {
        newProduct();
      }
    });
};

const bamazonSupervisor = () => {
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
};

const viewProducts = () => {
  connection.query("SELECT * FROM products", function(error, result) {
    if (error) {
      throw error;
    }
    console.table(result);
    bamazonAll();
  });
};

const lowInventory = () => {
  connection.query("SELECT * FROM products WHERE stock_quantity < 6", function(
    error,
    result
  ) {
    if (error) {
      throw error;
    }
    if (result[0] == undefined) {
      console.log("All products have more than 5 items in stock");
      bamazonAll();
    } else console.table(result);
    bamazonAll();
  });
};

const addInventory = () => {
  connection.query("SELECT * FROM products", function(error, results) {
    if (error) {
      throw error;
    }
    inquirer
      .prompt([
        {
          name: "itemSelect",
          type: "rawlist",
          message: "What item would you like to increase the inventory of?",
          choices: results.map(item => item.product_name)
        },
        {
          name: "itemQuantity",
          type: "input",
          message: "How many items will you be adding?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return "Invalid Entry; please enter a number";
          }
        }
      ])
      .then(function(answer) {
        let selection;
        for (let i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.itemSelect) {
            selection = results[i];
          }
        }
        let newQuantity =
          selection.stock_quantity + parseInt(answer.itemQuantity);
        connection.query(
          "UPDATE products SET ? WHERE?",
          [
            {
              stock_quantity: newQuantity
            },
            {
              id: selection.id
            }
          ],
          function(error) {
            if (error) {
              throw error;
            }
            console.log("Inventory Updated");
            bamazonAll();
          }
        );
      });
  });
};

const newProduct = () => {
  connection.query("SELECT * FROM departments", function(error, result) {
    if (error) {
      throw error;
    }
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What new product would you like to add?"
        },
        {
          name: "department",
          type: "rawlist",
          message: "What department will this product be in?",
          choices: result.map(item => item.name)
        },
        {
          name: "price",
          type: "input",
          message: "How much will this product be sold for?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return "Invalid Entry; please enter a number";
          }
        },
        {
          name: "quantity",
          type: "input",
          message: "How many of these products will be stocked?",
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
          "INSERT INTO products SET ?",
          [
            {
              product_name: answer.item,
              department_name: answer.department,
              price: answer.price,
              stock_quantity: answer.quantity
            }
          ],
          function(error) {
            if (error) {
              throw error;
            }
            console.log("New items successfully added");
            bamazonAll();
          }
        );
      });
  });
};

const viewDepartment = () => {
  connection.query(
    "SELECT d.id, d.name, d.overhead, SUM(p.product_sales) AS sales, SUM(p.product_sales) - d.overhead AS profit FROM departments AS d JOIN products AS p ON (d.name = p.department_name) GROUP BY d.id",
    function(error, result) {
      if (error) {
        throw error;
      }
      console.table(result);
      bamazonAll();
    }
  );
};

const createDepartment = () => {
  connection.query("SELECT * FROM departments", function(error, result) {
    if (error) {
      throw error;
    }
    inquirer
      .prompt([
        {
          name: "department",
          type: "input",
          message: "What new department would you like to create?",
          validate: function(value) {
            for (let i = 0; i < result.length; i++) {
              if (result[i].name === value) {
                return "This department already exists";
              }
            }
            return true;
          }
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
            bamazonAll();
          }
        );
      });
  });
};
