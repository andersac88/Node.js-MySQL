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
      } else if (answer.managerSelection === "Add New Products") {
        newProduct();
      }
    });
});

//   * List a set of menu options:

//     * View Products for Sale
//   * If a manager selects `View Products for Sale`, the app should list every available item: the item IDs, names, prices, and quantities.
const viewProducts = () => {
  connection.query("SELECT * FROM products", function(error, result) {
    if (error) {
      throw error;
    }
    console.table(result);
  });
};

//     * View Low Inventory
//   * If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

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
    } else console.table(result);
  });
};

//     * Add to Inventory
//   * If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

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
          choices: results.map(function(item) {
            return item.product_name;
          })
        },
        {
          name: "itemQuantity",
          type: "input",
          message: "How many items will you be adding?"
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
              item_id: selection.item_id
            }
          ],
          function(error) {
            if (error) {
              throw error;
            }
            console.log("Inventory Updated");
          }
        );
      });
  });
};

//     * Add New Product
//   * If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

const newProduct = () => {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "What new product would you like to add?"
      },
      {
        name: "department",
        type: "input",
        message: "What department will this product be in?"
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
        }
      );
    });
};
