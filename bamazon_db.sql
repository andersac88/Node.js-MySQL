DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10, 2) NOT NULL,
    stock_quantity INT NOT NULL
    );

    
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Television", "Electronics", 150.00, 15);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Speakers", "Electronics", 75.00, 20);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Toaster",  "Kitchen & Dining", 20.75, 30);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Blender", "Kitchen & Dining", 15.50, 25);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Furby", "Toys", 25.00, 50);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Monopoly", "Toys", 12.75, 30);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("T-Shirt", "Clothing", 10.00, 20);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Socks", "Clothing", 5.00, 30);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Jeans", "Clothing", 30.00, 20);
    INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ("Printer", "Electronics", 60.00, 10);
    

    SELECT * FROM products;