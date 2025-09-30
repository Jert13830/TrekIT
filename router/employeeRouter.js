const employeeRouter = require("express").Router();
const employeeController = require("../controllers/employeeController");

const authGuard = require("../middleware/services/authguard");

employeeRouter.get('/addEmployee',authGuard, employeeController.displayAddEmployee);
employeeRouter.post('/addEmployee',authGuard,employeeController.postEmployee);

employeeRouter.get('/employeeLogin',authGuard,employeeController.displayEmployeeLogin);
employeeRouter.post('/employeeLogin',authGuard, employeeController.login);

employeeRouter.post('/employeeList', authGuard, employeeController.treatEmployeeList);

employeeRouter.get('/homepage', authGuard, employeeController.displayHome);
module.exports = employeeRouter;



