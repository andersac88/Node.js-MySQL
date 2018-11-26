DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL (20, 2)
    );

CREATE TABLE departments (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
    overhead DECIMAL (10, 2)
);

    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Television", 1, "Electronics", 150.00, 15, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Speakers", 1, "Electronics", 75.00, 20, 150.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Toaster", 2, "Kitchen & Dining", 20.75, 30, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Blender", 2, "Kitchen & Dining", 15.50, 25, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Furby",  3,"Toys", 25.00, 50, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Monopoly", 3, "Toys", 12.75, 30, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("T-Shirt", 4, "Clothing", 10.00, 20, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Socks", 4, "Clothing", 5.00, 30, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Jeans", 4, "Clothing", 30.00, 20, 0.00);
    INSERT INTO products (product_name, department_id, department_name, price, stock_quantity, product_sales) VALUES ("Printer", 1, "Electronics", 60.00, 10, 0.00);

    
    INSERT INTO departments (name, overhead) VALUES ("Electronics", 500);
    INSERT INTO departments (name, overhead) VALUES ("Kitchen & Dining", 200);
    INSERT INTO departments (name, overhead) VALUES ("Toys", 50);
    INSERT INTO departments (name, overhead) VALUES ("Clothing", 50);
    
    SELECT * FROM products;
    SELECT * FROM departments;
 
    