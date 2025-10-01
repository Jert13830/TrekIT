const computerRouter = require("express").Router();
const computerController = require("../controllers/computerController");

const authGuard = require("../middleware/services/authguard");


computerRouter.get('/addComputer', authGuard, computerController.displayAddComputer);
computerRouter.post('/addComputer', authGuard,computerController.postComputer);

computerRouter.post('/computerList', authGuard, computerController.treatComputerList);

computerRouter.get('/assignComputer', authGuard, computerController.getComputerList);
computerRouter.post('/assignComputer', authGuard, computerController.assignComputer);

computerRouter.get("/removeComputer/:id",authGuard , computerController.removeComputer);

computerRouter.get("/updateComputer/:id", authGuard, computerController.displayUpdate);
computerRouter.post("/updateComputer/:id" , authGuard , computerController.updateComputer);


module.exports = computerRouter;



