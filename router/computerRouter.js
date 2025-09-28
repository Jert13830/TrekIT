const computerRouter = require("express").Router();
const computerController = require("../controllers/computerController");

const authGuard = require("../middleware/services/authguard");


computerRouter.get('/addComputer', authGuard, computerController.displayAddComputer);
computerRouter.post('/addComputer', authGuard,computerController.addComputer);
computerRouter.get("/removeComputer/:id",authGuard , computerController.removeComputer);
computerRouter.get("/updateComputer/:id", authGuard, computerController.displayUpdate);
computerRouter.post("/updateComputer/:id" , authGuard , computerController.updateComputer);


module.exports = computerRouter;



