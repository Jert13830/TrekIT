// controllers/companyController.js
const { PrismaClient } = require("../generated/prisma/client");
const hashExtension = require("../middleware/extensions/companyHashPassword");
const validateCompany = require("../middleware/extensions/validateCompany");
const bcrypt = require('bcrypt');

const prisma = new PrismaClient().$extends(validateCompany).$extends(hashExtension);

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