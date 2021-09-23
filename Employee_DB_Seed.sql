INSERT INTO departments (name)
VALUES ("Manufacturing"), ("Distribution"), ("Enforcement"), ("Legal");

SELECT * FROM departments; 

INSERT INTO roles (title, salary, department_id)
VALUES ("Lead manufacturer", 3000000, 1), ("Assistant manufacturer", 3000000, 1), ("Manager", 100000000, 2), ("Enforcer", 3000000, 3), ("Lawyer", 500000, 4);

SELECT * FROM roles;

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES ("Walter", "White", 1, NULL), ("Jesse", "Pinkman", 2, NULL), ("Gus", "Fring", 3, 1), ("Mike", "Ehrmantraut", 4, NULL), ("Saul", "Goodman", 5, NULL);

SELECT * FROM employees;