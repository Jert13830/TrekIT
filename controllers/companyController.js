// controllers/companyController.js
const { PrismaClient } = require("../generated/prisma/client");
const hashExtension = require("../middleware/extensions/hashPassword");
const validateCompany = require("../middleware/extensions/validateEmployeeCompany");

const prisma = new PrismaClient().$extends(validateCompany).$extends(hashExtension);

// Importation de bcrypt pour le hash et la comparaison des mots de passe
const bcrypt = require('bcrypt')


exports.displayRegister = async (req, res) => {
  res.render('pages/companySubscribe.twig', {
    title: "Inscription - Entreprise",
    error: null,
    duplicateSiret: null,
    companyName: null,
    directorName: null,
    confirmPassword: null,
  });
};

// Affiche la page de connexion
exports.displayLogin = async (req,res)=>{
    res.render("pages/login.twig", {
    title: "Connexion - Entreprise",
    error: null,
    duplicateSiret: null,
    confirmPassword: null
  })
}

exports.postCompany = async (req, res) => {
  try {
    // Verify passwords match
    if (req.body.password !== req.body.confirmPassword) {
      const error = new Error("Mot de passe non correspondant");
      error.confirmPassword = error.message; // Match template field name
      throw error;
    }

    // Create a new company
    const company = await prisma.company.create({
      data: {
        companyName: req.body.companyName,
        siret: req.body.siret.replace(/\s/g, ''), // Remove spaces
        password: req.body.password, // Handled by hashExtension
        directorName: req.body.directorName || null,
      },
    });

    // Redirect to login on success
    res.redirect('/login');

  } catch (error) {
    console.log('Error:', error);
    if (error.code === 'P2002') {
      // Unique constraint violation (duplicate SIRET)
      return res.render('pages/companySubscribe.twig', {
        title: "Inscription - Entreprise",
        error: null,
        duplicateSiret: "Siret déjà utilisé",
        companyName: req.body.companyName,
        directorName: req.body.directorName,
        confirmPassword: req.body.confirmPassword,
      });
    } else {
      // Other errors (validation or password mismatch)
      const errorDetails = error.confirmPassword
        ? { confirmPassword: error.confirmPassword }
        : { siret: error.details || 'Une erreur est survenue lors de l\'inscription' };
      res.render('pages/companySubscribe.twig', {
        title: "Inscription - Entreprise",
        error: errorDetails,
        duplicateSiret: null,
        companyName: req.body.companyName,
        directorName: req.body.directorName,
        confirmPassword: req.body.confirmPassword,
      });
    }
  }
};

exports.login = async (req,res)=>{
    try {
        // research the company by its Siret number 
        const company = await prisma.company.findUnique({
            where: {
                siret: req.body.siret
            }
        })
        
        if (company) {
            // if the company exists we check the password against the hashed password
            if (bcrypt.compareSync(req.body.password,company.password)) {
                // If the password is correct the company is stocked in the session
                req.session.company = company
                // Send to the Dashboard
                res.redirect('/dashboard')
            } else {
                // if the password is incorrect show an error
                throw {password: "mauvais mot de passe"}
            }
        } else {
            // If the company does not exist
            throw {siret: "Cette société n'est pas enregistrée"}
        }
    } catch (error) {
        // Show the errors in the login
        //Error
        //res.redirect('/companySubscribe');
        res.render("pages/login.twig", {
            error:error
            
        })
        
    }
}

// controllers/companyController.js
exports.displayDashboard = async (req, res) => {
    try {
        // Assuming the company is stored in req.session.company by authGuard
        const company = req.session.company;
        res.render('pages/dashboard.twig', {
            title: 'Tableau de bord',
            company: company, // Pass company data to the template
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.redirect('/login'); // Redirect to login on error
    }
};