// controllers/employeeController.js
const { PrismaClient } = require("../generated/prisma/client");
const hashExtension = require("../middleware/extensions/employeeHashPassword");
const validateemployee = require("../middleware/extensions/validateemployee");

const prisma = new PrismaClient().$extends(validateemployee).$extends(hashExtension);

// Importation de bcrypt pour le hash et la comparaison des mots de passe
const bcrypt = require('bcrypt')


exports.displayRegister = async (req, res) => {
  res.render('pages/employeeSubscribe.twig', {
    title: "Inscription - Entreprise",
    error: null,
    duplicateSiret: null,
    employeeName: null,
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

exports.postemployee = async (req, res) => {
  try {
    // Verify passwords match
    if (req.body.password !== req.body.confirmPassword) {
      const error = new Error("Mot de passe non correspondant");
      error.confirmPassword = error.message; // Match template field name
      throw error;
    }

    // Create a new employee
    const employee = await prisma.employee.create({
      data: {
        employeeName: req.body.employeeName,
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
      return res.render('pages/employeeSubscribe.twig', {
        title: "Inscription - Entreprise",
        error: null,
        duplicateSiret: "Siret déjà utilisé",
        employeeName: req.body.employeeName,
        directorName: req.body.directorName,
        confirmPassword: req.body.confirmPassword,
      });
    } else {
      // Other errors (validation or password mismatch)
      const errorDetails = error.confirmPassword
        ? { confirmPassword: error.confirmPassword }
        : { siret: error.details || 'Une erreur est survenue lors de l\'inscription' };
      res.render('pages/employeeSubscribe.twig', {
        title: "Inscription - Entreprise",
        error: errorDetails,
        duplicateSiret: null,
        employeeName: req.body.employeeName,
        directorName: req.body.directorName,
        confirmPassword: req.body.confirmPassword,
      });
    }
  }
};

exports.login = async (req,res)=>{
    try {
        // research the employee by its Siret number 
        const employee = await prisma.employee.findUnique({
            where: {
                siret: req.body.siret
            }
        })
        
        if (employee) {
            // if the employee exists we check the password against the hashed password
            if (bcrypt.compareSync(req.body.password,employee.password)) {
                // If the password is correct the employee is stocked in the session
                req.session.employee = employee
                // Send to the Dashboard
                res.redirect('/dashboard')
            } else {
                // if the password is incorrect show an error
                throw {password: "mauvais mot de passe"}
            }
        } else {
            // If the employee does not exist
            throw {siret: "Cette société n'est pas enregistrée"}
        }
    } catch (error) {
        // Show the errors in the login
        //Error
        //res.redirect('/employeeSubscribe');
        res.render("pages/login.twig", {
            error:error
            
        })
        
    }
}

// controllers/employeeController.js
exports.displayDashboard = async (req, res) => {
    try {
        // Assuming the employee is stored in req.session.employee by authGuard
        const employee = req.session.employee;
        res.render('pages/dashboard.twig', {
            title: 'Tableau de bord',
            employee: employee, // Pass employee data to the template
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.redirect('/login'); // Redirect to login on error
    }
};