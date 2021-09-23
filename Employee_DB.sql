DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE departments (
  id INTEGER AUTO_INCREMENT NOT NULL,
  name VARCHAR(40) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE roles (
  id INTEGER AUTO_INCREMENT NOT NULL,
  title VARCHAR(40) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES departments (id)
);


CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES roles (id),
    FOREIGN KEY (manager_id) REFERENCES employees (id)
);
