const employeeRouter = require("express").Router();
const employeeController = require("../controllers/employeeController");

const authGuard = require("../middleware/services/authguard");

employeeRouter.get('/addEmployee' , employeeController.displayAddEmployee);
employeeRouter.post('/addEmployee', employeeController.postEmployee);
employeeRouter.get('/employeeLogin',employeeController.displayEmployeeLogin);
employeeRouter.post('/employeeLogin', employeeController.login);

employeeRouter.get('/homepage', authGuard, employeeController.displayHome);
module.exports = employeeRouter;



