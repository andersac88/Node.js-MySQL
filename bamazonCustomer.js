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
  if (error) throw error;

  connection.query("SELECT * FROM products", function(error, result) {
    if (error) {
      throw error;
    }

    console.table(result);
    //     The app should then prompt users with two messages.
    inquirer
      .prompt([
        //     * The first should ask them the ID of the product they would like to buy.
        {
          type: "rawlist",
          message:
            "Please select the ID of the item you would like to purchase.",
          choices: result.map(function(item) {
            return item.id.toString();
          }),
          name: "idSelector"
        },
        {
          //     * The second message should ask how many units of the product they would like to buy.
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
        //  7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

        let userChoice;
        for (var i = 0; i < result.length; i++) {
          if (result[i].id == answer.idSelector) {
            userChoice = result[i];
          }
        }

        //  8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.

        if (userChoice.stock_quantity > parseInt(answer.howMany)) {
          let newQuantity = userChoice.stock_quantity - answer.howMany;
          let amountSpent = answer.howMany * userChoice.price;
          let productSale = userChoice.product_sales + amountSpent;

          connection.query(
            //     * This means updating the SQL database to reflect the remaining quantity.
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
              //     * Once the update goes through, show the customer the total cost of their purchase.
              console.log(
                `Purchase Successfull, your total is $${amountSpent}`
              );
            }
          );
        } else {
          //     * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
          console.log("Insufficient quantity!");
        }
      });
  });
});
