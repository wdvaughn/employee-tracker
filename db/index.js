const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  findAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, " +
      "CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id " +
      "LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  findManagedEmployees(managerId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, " +
      "CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id " +
      "LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id " +
      "WHERE employee.manager_id = ?;", managerId
    );
  }

  findAllDepartments() {
    return this.connection.query("SELECT * FROM department");
  }

  findAllRoles() {
    return this.connection.query("SELECT * FROM role");
  }

  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }

  createDepartment(department) {
    return this.connection.query("INSERT INTO department SET ?", department);
  }

  createRole(role) {
    return this.connection.query("INSERT INTO role SET ?", role);
  }

  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query("UPDATE employee SET role_id = ? WHERE id = ?", [roleId, employeeId]);
  }

  updateEmployeeManager(employeeId, managerId) {
    return this.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId]);
  }

  deleteEmployee(employeeId) {
    return this.connection.query("DELETE FROM employee WHERE id = ?", [employeeId]);
  }

  deleteDepartment(departmentId) {
    return this.connection.query("DELETE FROM department WHERE id = ?", [departmentId]);
  }

  deleteRole(roleId) {
    return this.connection.query("DELETE FROM role WHERE id = ?", [roleId]);
  }
}

module.exports = new DB(connection);