const companyRouter = require("express").Router();

companyRouter.get('/companySubscribe',(req,res)=>{
    res.render('pages/companySubscribe.twig',
        {
            title: " Inscription - Entreprise"
        }
    )
});

module.exports = companyRouter;



