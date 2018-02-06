const mysql = require('mysql2');
const inquirer = require('inquirer');
let Table = require('cli-table');

let currentStock = 0;

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'bamazon'
});

function main() {
    inquirer.prompt([{
        type: "list",
        name: "managerOptions",
        message: "What do you want to do??",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (manager) {
        let option = manager.managerOptions;
        if (option === "View Products for Sale") {
            productsForSale();
        } else if (option === "View Low Inventory") {
            lowInventory();
        } else if (option === "Add to Inventory") {
            addInventory();
        } else if (option === "Add New Product") {
            newProduct();
        }
    });
};

//Call the main menu
main();

function productsForSale() {
    console.log("Items Available for Sale")
    //TO SHOW ITEMS
    connection.query(
        'SELECT * FROM `products` WHERE stock_quantity>0',
        function (err, results, fields) {
            var table = new Table({
                head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
                colWidths: [5, 50, 50, 10, 10]
            });
            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
                );
            }
            //Display the table 
            console.log(table.toString());
            main();
        })
};

function lowInventory() {
    console.log("Items with Inventory fewer than 5")
    //TO SHOW ITEMS
    connection.query(
        'SELECT * FROM `products` WHERE stock_quantity<6',
        function (err, results, fields) {
            var table = new Table({
                head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
                colWidths: [5, 50, 50, 10, 10]
            });
            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
                );
            }
            //Display the table 
            console.log(table.toString());
            main();
        })
};

function addInventory() {
    console.log("Items Available for Sale")
    //TO SHOW ITEMS
    connection.query(
        'SELECT * FROM `products` WHERE stock_quantity>0',
        function (err, results, fields) {
            var table = new Table({
                head: ['ID', 'Product', 'Department', 'Price', 'Stock'],
                colWidths: [5, 50, 50, 10, 10]
            });
            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
                );
            }
            //Display the table 
            console.log(table.toString());
            inquirer.prompt([{
                    type: "input",
                    name: "id_key",
                    message: "What id product you want to add inventory?"
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "How many more items you want to add to this inventory?"
                }
            ]).then(function (product) {
                connection.query(
                    'SELECT * FROM `products` WHERE item_Id=?', [`${product.id_key}`],
                    function (err, results, fields) {

                        currentStock = (+results[0].stock_quantity + +product.quantity);

                        //TO UPDATE
                        connection.query(
                            'UPDATE `products` SET ? WHERE ?', [{
                                    stock_quantity: +currentStock
                                },
                                {
                                    item_id: product.id_key
                                }
                            ],
                            function (err, data, fields) {
                                console.log("New Inventory " + currentStock + " for " + results[0].product_name);
                                main();
                            });
                    })
            })
        });
    // main(); **********
}

function newProduct() {
    inquirer.prompt([

        {
            type: "input",
            name: "productName",
            message: "Name of the Product?"
        },
        {
            type: "input",
            name: "department",
            message: "Which department?"
        },
        {
            type: "input",
            name: "price",
            message: "What's the price?"
        },
        {
            type: "input",
            name: "inventory",
            message: "What's the inventory?"
        }
    ]).then(function (newProduct) {
        //TO UPDATE
        let initialSales = 0;
        connection.query(
            'INSERT INTO `products`  (product_name,department_name,price,stock_quantity,product_sales) VALUES (?,?,?,?,?)', [
                newProduct.productName,
                newProduct.department,
                newProduct.price,
                newProduct.inventory,
                initialSales
            ],
            function (err, results, fields) {
                console.log(newProduct.productName+" added Sucessfully!"); // results contains rows returned by server
                main();
            }
        );
    })
}