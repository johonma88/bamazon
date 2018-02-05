const mysql = require('mysql2');
const inquirer = require('inquirer');
let Table = require('cli-table');

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
        choices: ["View Product Sales by Department", "Create New Department"]
    }]).then(function (manager) {
        let option = manager.managerOptions;
        if (option === "View Product Sales by Department") {
            salesByDepartment();
        } else if (option === "Create New Department") {
            createNewDepartment();
        }
    });
};

main();

function salesByDepartment() {
    connection.query(
        'SELECT departments.department_id, departments.department_name, departments.over_head_cost, products.product_sales FROM `departments`  JOIN `products` ON (departments.department_name=products.department_name) ', //GROUP BY departments.department_id,departments.department_name
        function (err, results, fields) {
            var table = new Table({
                head: ['ID', 'Department', 'Over Head Cost', 'Sales', 'Total Profit'],
                colWidths: [5, 50, 10, 10, 10]
            });
            console.log(results);

            for (var i = 0; i < results.length; i++) {
                table.push(
                    [results[i].department_id, results[i].department_name, results[i].over_head_cost, results[i].product_sales, (+results[i].over_head_cost * +results[i].product_sales)]
                );
            }
            //Display the table 
            console.log(table.toString());
            main();
        })

}

function createNewDepartment() {
    inquirer.prompt([

        {
            type: "input",
            name: "departmentName",
            message: "Name of the Department?"
        },
        {
            type: "input",
            name: "over_head_cost",
            message: "Over Head Cost of the new department?"
        }
    ]).then(function (newDepartment) {
        //TO UPDATE
        connection.query(
            'INSERT INTO `departments`  (department_Name,Over_head_cost) VALUES (?,?)', [
                newDepartment.departmentName,
                newDepartment.over_head_cost

            ],
            function (err, results, fields) {
                console.log("Department created"); // results contains rows returned by server
                main();
            }
        );
    })
}