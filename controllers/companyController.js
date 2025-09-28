
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const validateCompany = require("../middleware/extensions/validateCompany")
//const prisma = new PrismaClient().$extends(validateCompany).$extends(hashExtension)
const bcrypt = require('bcrypt');

//show page and change title
exports.displayRegister = async (req,res)=>{
    res.render('pages/companySubscribe.twig',
        {
            title: " Inscription - Entreprise"
        }
    )
};

exports.postCompany = async (req,res)=>{
try {
    if(req.body.password === req.body.confirmPassword){
        const company = await Prisma.company.create({
            data:{
                companyName : req.body.companyName,
                siret : req.body.siret,
                password : req.body.password,
                directorName : req.body.directorName

            }
        });

        res.redirect("/login");
    }
    else throw({confirmPassword:"Vos mots de passe ne correspondent pas"});
    
} catch (error) {
    console.log(error);
    
}
};

