// Importation de PrismaClient et des extensions personnalisées
const { PrismaClient } = require("../generated/prisma/client")
const hashExtension = require("../middleware/extensions/companyHashPassword")
const validateCompany = require("../middleware/extensions/validateCompany")
// On étend PrismaClient avec les extensions de validation et de hashage
const prisma = new PrismaClient().$extends(validateCompany).$extends(hashExtension)
// Importation de bcrypt pour le hash et la comparaison des mots de passe
const bcrypt = require('bcrypt')

//show page and change title
exports.displayRegister = async (req,res)=>{
    res.render('pages/companySubscribe.twig',
        {
            title: " Inscription - Entreprise"
        }
    )
};


exports.postCompany = async (req, res) => {
    try {
         // Vérifie si les deux mots de passe correspondent
        if (req.body.password == req.body.confirm) {
           
            // Crée un nouvel company en base (validation et hashage via extensions Prisma)
            const company = await prisma.company.create({
                data:{
                    companyName : req.body.companyName,
                    siret : req.body.siret.replace(/\s/g, ''),
                    password : req.body.password,
                    directorName : req.body.directorName

                }
            });
            // Redirige vers la page de connexion après inscription réussie
            res.redirect('/login');
        } else {
            // Si les mots de passe ne correspondent pas, on lève une erreur personnalisée
            const error = new Error("Mot de passe non correspondant")
            error.confirm = error.message
            throw error
        }
    } catch (error) {
        console.log(error.code);
        // Gestion des erreurs lors de l'inscription
        if (error.code == 'P2002') {
            // Erreur d'unicité (siret déjà utilisé)
            res.render("pages/companySubscribe.twig", {
                duplicateSiret: "Siret deja utilisé"
            })
        } else {
            // Autres erreurs de validation ou de confirmation
            res.render("pages/companySubscribe.twig", {
                errors: error.details,
                confirmError: error.confirm ? error.confirm : null
            })
        }
    }
};

