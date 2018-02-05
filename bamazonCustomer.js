const mysql = require('mysql2');
const inquirer = require('inquirer');
let confirm = require('inquirer-confirm');
let Table = require('cli-table');
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'bamazon'
});

// Global Variables
let currentStock = 0;
let cost = 0;
let currentSales = 0;



function display() {
    console.log("Item Available for Sale")
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
                    message: "What id product you want to buy?"
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "How many?"
                }
            ]).then(function (product) {
                connection.query(
                    'SELECT * FROM `products` WHERE item_Id=?', [`${product.id_key}`],
                    function (err, results, fields) {
                        if (product.quantity < results[0].stock_quantity) {
                            currentStock = (results[0].stock_quantity - product.quantity);
                            currentSales = results[0].product_sales;
                            cost = (results[0].price * product.quantity);
                            //TO UPDATE
                            connection.query(
                                'UPDATE `products` SET ? WHERE ?', [{
                                        stock_quantity: +currentStock,
                                        product_sales: +currentSales + +cost 
                                    },
                                    {
                                        item_id: product.id_key
                                    }
                                ],
                                function (err, data, fields) {
                                    console.log("You bought " + product.quantity + " " + results[0].product_name + " for " + cost + " dollars sucessfully!");
                                    KeepBuying();
                                });
                        } else {
                            console.log("Insuficient Stock");
                            KeepBuying();
                        }
                    }
                )
            });
        })
};

function KeepBuying() {
    confirm('Do you want to keep buying?')
        .then(function confirmed() {
            display();
        }, function cancelled() {
            console.log("Hope to see you again!");
        });
};

display();