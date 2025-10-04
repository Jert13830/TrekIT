const companyRouter = require("express").Router();
const companyController = require("../controllers/companyController");

const authGuard = require("../middleware/services/authguard");

companyRouter.get('/companySubscribe' , companyController.displayRegister);
companyRouter.post('/companySubscribe', companyController.postCompany);

companyRouter.get('/login',companyController.displayLogin);
companyRouter.post('/login', companyController.login);
companyRouter.get("/logout", companyController.logout);

companyRouter.get('/dashboard', authGuard, companyController.displayDashboard);
companyRouter.get('/employees',authGuard, companyController.displayEmployees);
companyRouter.get('/computers',authGuard, companyController.displayComputers);

companyRouter.get("/updateCompany", authGuard, companyController.displayUpdateCompany);
companyRouter.post("/updateCompany/:id" , authGuard , companyController.updateCompany);

companyRouter.get("/showCompanyFaults", authGuard, companyController.displayComputerFaults);

module.exports = companyRouter;



