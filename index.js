const { prompt } = require("inquirer");
const db = require("./db");
require("console.table");
//const VIEW_EMPLOYEES_BY_DEPARTMENT = "VIEW_EMPLOYEES_BY_DEPARTMENT";
//const VIEW_EMPLOYEES_BY_MANAGER = "VIEW_EMPLOYEES_BY_MANAGER";

const VIEW_EMPLOYEES = "VIEW_EMPLOYEES";
const ADD_EMPLOYEE = "ADD_EMPLOYEE";
const UPDATE_EMPLOYEE_ROLES = "UPDATE_EMPLOYEE_ROLES";
const UPDATE_EMPLOYEE_MANAGER = "UPDATE_EMPLOYEE_MANAGER";
const DELETE_EMPLOYEE = "DELETE_EMPLOYEE";

const VIEW_DEPARTMENTS = "VIEW_DEPARTMENTS";
const ADD_DEPARTMENT = "ADD_DEPARTMENT";
const VIEW_DEPARTMENT_BUDGET = "VIEW_DEPARTMENT_BUDGET";
const DELETE_DEPARTMENT = "DELETE_DEPARTMENT";

const VIEW_ROLES = "VIEW_ROLES";
const ADD_ROLE = "ADD_ROLE";
const DELETE_ROLE = "DELETE_ROLE";

const QUIT = "QUIT";

const loadMainPrompts = async () => {
    const { choice } = await prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Employees',
                    value: VIEW_EMPLOYEES
                },
                {
                    name: 'View All Departments',
                    value: VIEW_DEPARTMENTS
                },
                {
                    name: 'View All Roles',
                    value: VIEW_ROLES
                },
                {
                    name: 'Add Employee',
                    value: ADD_EMPLOYEE
                },
                {
                    name: 'Add Department',
                    value: ADD_DEPARTMENT
                },
                {
                    name: 'Add Role',
                    value: ADD_ROLE
                },
                {
                    name: 'Update Employee Role',
                    value: UPDATE_EMPLOYEE_ROLES
                },
                {
                    name: "Update Employee Manager",
                    value: UPDATE_EMPLOYEE_MANAGER
                },
                {
                    name: "Delete Employee",
                    value: DELETE_EMPLOYEE
                },
                {
                    name: "Delete Department",
                    value: DELETE_DEPARTMENT
                },
                {
                    name: "Delete Role",
                    value: DELETE_ROLE
                },
                {
                    name: "View Department Budget",
                    value: VIEW_DEPARTMENT_BUDGET
                },
                {
                    name: 'Quit',
                    value: QUIT
                }
            ]
        }
    ]);

    switch (choice) {
        case VIEW_EMPLOYEES:
            return viewEmployees();
        case VIEW_DEPARTMENTS:
            return viewDepartments();
        case VIEW_ROLES:
            return viewRoles();
        case ADD_EMPLOYEE:
            return addEmployee();
        case ADD_DEPARTMENT:
            return addDepartment();
        case ADD_ROLE:
            return addRole();
        case UPDATE_EMPLOYEE_ROLES:
            return updateEmployeeRoles();
        case UPDATE_EMPLOYEE_MANAGER:
            return updateEmployeeManager();
        case DELETE_EMPLOYEE:
            return deleteEmployee();
        case DELETE_DEPARTMENT:
            return deleteDepartment();
        case DELETE_ROLE:
            return deleteRole();
        case VIEW_DEPARTMENT_BUDGET:
            return viewDepartmentBudget();
        default:
            return quit();
    }
}

async function viewEmployees() {
    const employees = await db.findAllEmployees();

    console.log("\n");
    console.table(employees);

    loadMainPrompts();
}

async function viewDepartments() {
    const departments = await db.findAllDepartments();

    console.log("\n");
    console.table(departments);

    loadMainPrompts();
}

async function viewRoles() {
    const roles = await db.findAllRoles();

    console.log("\n");
    console.table(roles);

    loadMainPrompts();
}

async function addEmployee() {
    const roles = await db.findAllRoles();
    const employees = await db.findAllEmployees();

    const employee = await prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ]);

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    //role prompt
    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices
        }
    ]);

    employee.role_id = roleId;

    // manager choices
    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    managerChoices.unshift({ name: "None", value: null })

    // manager prompt
    const { managerId } = await prompt([
        {
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices
        }
    ]);

    employee.manager_id = managerId;

    await db.createEmployee(employee);

    loadMainPrompts();
}

async function addDepartment() {
    const department = await prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ]);

    await db.createDepartment(department);

    loadMainPrompts();
}

async function addRole() {
    const departments = await db.findAllDepartments();

    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    // role prompt
    const role = await prompt([
        {
            name: "title",
            message: "What is the role's title?"
        },
        {
            name: "salary",
            message: "What is the role's salary?"
        },
        {
            type: "list",
            name: "department_id",
            message: "What department is the role part of?",
            choices: departmentChoices
        }
    ]);

    await db.createRole(role);

    loadMainPrompts();
}

async function updateEmployeeRoles() {
    const employees = await db.findAllEmployees();
    const roles = await db.findAllRoles();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    // employee prompt
    const { employeeId, roleId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "What employee is changing roles?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "roleId",
            message: "What role is the employee going to?",
            choices: roleChoices
        }
    ]);
    // role prompt

    await db.updateEmployeeRole(employeeId, roleId);

    loadMainPrompts();
}

async function updateEmployeeManager() {
    const employees = await db.findAllEmployees();

    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    managerChoices.unshift({ name: "None", value: null });

    // employee prompt
    const { employeeId, managerId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "What employee is changing managers?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "managerId",
            message: "Which manager is the employee going to?",
            choices: managerChoices
        }
    ]);
    // role prompt

    await db.updateEmployeeManager(employeeId, managerId);

    loadMainPrompts();
}

async function deleteEmployee() {
    employees = await db.findAllEmployees();

    employeeChoices = employees.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    const { employeeId } = await prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee should be deleted?",
            choices: employeeChoices
        }
    ]);

    await db.deleteEmployee(employeeId);

    loadMainPrompts();
}

async function deleteDepartment() {
    departments = await db.findAllDepartments();

    departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));

    const { departmentId } = await prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department should be deleted?",
            choices: departmentChoices
        }
    ]);

    await db.deleteDepartment(departmentId);

    loadMainPrompts();
}

async function deleteRole() {
    roles = await db.findAllRoles();

    roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));

    const { roleId } = await prompt([
        {
            type: "list",
            name: "roleId",
            message: "Which role should be deleted?",
            choices: roleChoices
        }
    ]);

    await db.deleteRole(roleId);

    loadMainPrompts();
}

async function viewDepartmentBudget() {
    employees = await db.findAllEmployees();
    departments = await db.findAllDepartments();

    departmentChoices = departments.map(({ name }) => ({
        name: name,
        value: name
    }));

    const { department } = await prompt({
        type: "list",
        name: "department",
        message: "Which department would you like the budget of?",
        choices: departmentChoices
    });

    const departmentEmployees = employees.filter(employee => (employee.department === department));

    let budget = 0

    departmentEmployees.forEach(employee => (budget += employee.salary));

    console.log(`Total Budget for ${department}: ${budget}`);

    loadMainPrompts();
}

function quit() {
    process.exit(0);
}

loadMainPrompts();