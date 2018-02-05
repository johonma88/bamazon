const mysql = require('mysql2');
const inquirer = require('inquirer');
let Table = require('cli-table');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'bamazon'
});

inquirer.prompt([
    {
      type: "list",
      name: "managerOptions",
      message: "What do you want to do??",
      choices: ["View Products for Sale", "View Low Inventory","Add to Inventory","Add New Product"]
    }
]).then(function(manager) {

});