const companyRouter = require("express").Router();
const companyController = require("../controllers/companyController");
//const authGuard = require("../middleware/services/authguard")


companyRouter.get('/companySubscribe' , companyController.displayRegister)
companyRouter.post('/companySubscribe', companyController.postCompany)



module.exports = companyRouter;



