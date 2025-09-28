const companyRouter = require("express").Router();
const companyController = require("../controllers/companyController");

const authGuard = require("../middleware/services/authguard");

companyRouter.get('/companySubscribe' , companyController.displayRegister);
companyRouter.post('/companySubscribe', companyController.postCompany);
companyRouter.get('/login',companyController.displayLogin);
companyRouter.post('/login', companyController.login);

companyRouter.get('/dashboard', authGuard, companyController.displayDashboard);
module.exports = companyRouter;



