const mysql = require("mysql");
const express = require("express");
const inquirer = require("inquirer");
const dotenv = require("dotenv");
require("dotenv").config();
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const mainQuestions = [
  "View Employee",
  "View Role",
  "View Department",
  "Add Employee",
  "Add Role",
  "Add Department",
  "Update Employee Role",
  "Exit!",
];

const addEmployee = async () => {
  const { first_name, last_name } = await inquirer.prompt([
    {
      type: "input",
      message: "Enter the employee's first name",
      name: "first_name",
    },
    {
      type: "input",
      message: "Enter the employee's last name.",
      name: "last_name",
    },
  ]);
  connection.query("SELECT * FROM roles", async (err, res) => {
    if (err) throw err;
    const roleArr = res.map(({ title }) => title);
    const { chosenRole, hasManager } = await inquirer.prompt([
      {
        type: "list",
        message: "Enter the employee's role.",
        name: "chosenRole",
        choices: roleArr,
      },
      {
        type: "confirm",
        message: "Does this employee have a manager?",
        name: "hasManager",
      },
    ]);

    let roleObj;
    res.forEach((role) => {
      if (chosenRole === role.title) {
        roleObj = role;
      }
    });
    if (hasManager) {
      connection.query("SELECT * FROM employees", async (err, res) => {
        if (err) throw err;
        const employeeArr = res.map(
          ({ first_name, last_name }) => `${first_name} ${last_name}`
        );
        const { chosenManager } = await inquirer.prompt([
          {
            type: "list",
            message: "Select the employee's manager",
            name: "chosenManager",
            choices: employeeArr,
          },
        ]);

        let managerObj;
        res.forEach((employee) => {
          if (
            chosenManager === `${employee.first_name} ${employee.last_name}`
          ) {
            managerObj = employee;
          }
        });

        connection.query(
          "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
          [first_name, last_name, roleObj["id"], managerObj["id"]],
          (err, res) => {
            if (err) throw err;
            console.log(
              `You have added ${first_name} ${last_name} as an employee.`
            );
            init();
          }
        );
      });
    } else {
      connection.query(
        "INSERT INTO employees (first_name, last_name, role_id) VALUES (?,?,?)",
        [first_name, last_name, roleObj["id"]],
        (err, res) => {
          if (err) throw err;
          console.log(
            `You have added ${first_name} ${last_name} as an employee.`
          );
          init();
        }
      );
    }
  });
};

const addRole = async () => {
  let { title, salary } = await inquirer.prompt([
    {
      type: "input",
      message: "Enter name of the role.",
      name: "title",
    },
    {
      type: "input",
      message: "Enter Salary of the role.",
      name: "salary",
    },
  ]);
  connection.query("SELECT * FROM departments", async (err, res) => {
    if (err) throw err;
    const depoArr = res.map(({ name }) => name);
    const { chosenDepo } = await inquirer.prompt([
      {
        type: "list",
        message: "Enter department that this role belongs to.",
        name: "chosenDepo",
        choices: depoArr,
      },
    ]);

    let depoObj;
    res.forEach((depo) => {
      if (depo.name === chosenDepo) {
        depoObj = depo;
      }
    });

    connection.query(
      "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
      [title, salary, depoObj["id"]],
      (err, res) => {
        if (err) throw err;
        console.log(
          `The new ${title} role has been added to the ${chosenDepo} department.`
        );
      }
    );
    init();
  });
};

const viewTable = (table, choice) => {
  connection.query("SELECT * FROM ??", table, (err, res) => {
    if (err) throw err;
    console.table(res);
    init();
  });
};

const addDepartment = async () => {
  const { name } = await inquirer.prompt([
    {
      type: "input",
      message: "Enter the name of the department",
      name: "name",
    },
  ]);
  connection.query(
    "INSERT INTO departments (name) VALUES (?)",
    name,
    (err, res) => {
      if (err) throw err;
      console.log(`\nA  Department ${name} has been created?\n`);
      init();
    }
  );
};

const updateEmployeeRole = () => {
  connection.query("SELECT * FROM employees", async (err, res) => {
    if (err) throw err;
    const employeeArr = res.map(
      ({ first_name, last_name }) => `${first_name} ${last_name}`
    );
    const { chosenEmployee } = await inquirer.prompt([
      {
        type: "list",
        message: "Choose which employee you'd like to update.",
        name: "chosenEmployee",
        choices: employeeArr,
      },
    ]);

    let employeeObj;
    res.forEach((employee) => {
      if (chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
        employeeObj = employee;
      }
    });
    connection.query("SELECT * FROM roles", async (err, res) => {
      if (err) throw err;
      const roleArr = res.map(({ title }) => title);
      const { chosenRole } = await inquirer.prompt([
        {
          type: "list",
          message: `Select the role you'd like to give ${chosenEmployee}`,
          name: "chosenRole",
          choices: roleArr,
        },
      ]);

      console.log(chosenRole);

      let roleObj;
      res.forEach((role) => {
        if (chosenRole === role.title) {
          roleObj = role;
        }
      });
      console.log(roleObj);
      console.log(employeeObj);
      connection.query(
        "UPDATE employees SET ? WHERE ?",
        [{ role_id: roleObj["id"] }, { id: employeeObj["id"] }],
        (err, res) => {
          if (err) throw err;
          console.log(
            `You have changed ${chosenEmployee}'s role to ${chosenRole}`
          );
          init();
        }
      );
    });
  });
};

const init = async () => {
  const { userChoice } = await inquirer.prompt([
    {
      type: "list",
      message: "Select your action.",
      name: "userChoice",
      choices: mainQuestions,
    },
  ]);
  switch (userChoice) {
    case "Add Employee":
      addEmployee();
      break;
    case "Add Role":
      addRole();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "View Employee":
      viewTable("employees");
      break;
    case "View Role":
      viewTable("roles");
      break;
    case "View Department":
      viewTable("departments");
      break;
    case "Update Employee Role":
      updateEmployeeRole();
      break;
    case "Exit!":
      connection.end();
  }
};

connection.connect((err) => {
  if (err) throw err;
  console.log("connect");
  init();
});
