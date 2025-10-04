const employeeRouter = require("express").Router();
const employeeController = require("../controllers/employeeController");

const authGuard = require("../middleware/services/authguard");

employeeRouter.get('/addEmployee',authGuard, employeeController.displayAddEmployee);
employeeRouter.post('/addEmployee',authGuard,employeeController.postEmployee);

employeeRouter.get('/employeeLogin',employeeController.displayEmployeeLogin);
employeeRouter.post('/employeeLogin',employeeController.login);
employeeRouter.get("/employeeLogout", employeeController.employeeLogout);


employeeRouter.post('/employeeList', authGuard, employeeController.treatEmployeeList);

employeeRouter.get("/updateEmployee/:id", authGuard, employeeController.displayUpdate);
employeeRouter.post("/updateEmployee/:id" , authGuard , employeeController.updateEmployee);

employeeRouter.get('/homepage', authGuard, employeeController.displayHome);

employeeRouter.get('/employReportedFaults', authGuard, employeeController.employeeReportedFaults);
employeeRouter.post('/employReportedFaults', authGuard, employeeController.employeeReportFault);

module.exports = employeeRouter;
