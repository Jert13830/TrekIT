// controllers/employeeController.js
const { PrismaClient } = require("../generated/prisma/client");
const hashExtension = require("../middleware/extensions/hashPassword");
const validateEmployee = require("../middleware/extensions/validateEmployeeCompany");

const prisma = new PrismaClient().$extends(validateEmployee).$extends(hashExtension);

// Importation de bcrypt pour le hash et la comparaison des mots de passe
const bcrypt = require('bcrypt')


exports.displayAddEmployee = async (req, res) => {
  res.render('pages/addEmployee.twig', {
    title: "Inscription - Employé",
    error: null,
    duplicateSiret: null,
    employeeName: null,
    directorName: null,
    confirmPassword: null,
  });
};

// Affiche la page de connexion
exports.displayEmployeeLogin = async (req,res)=>{
    res.render("pages/employeeLogin.twig", {
    title: "Connexion - Employé",
    error: null,
    duplicateSiret: null,
    confirmPassword: null
  })
}

exports.postEmployee = async (req, res) => {
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
          email: req.body.mail,
          password: req.body.password,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dob: req.body.dob || null,
          gender: req.body.gender || null,
      },
    });

    // Redirect to login on success
    res.redirect('/employees');

  } catch (error) {
        // Gestion des erreurs lors de l'inscription
        if (error.code == 'P2002') {
            // Erreur d'unicité (email déjà utilisé)
            res.render("pages/addEmployee.twig", {
                duplicateEmail: "Email deja utilisé"
            })
        } else {
            // Autres erreurs de validation ou de confirmation
            res.render("pages/addEmployee.twig", {
                errors: error.details,
                confirmError: error.confirm ? error.confirm : null
            })
        }
    }
};

exports.login = async (req,res)=>{
    try {
        // Recherche l'utilisateur en base par son email
        const employee = await prisma.employee.findUnique({
            where: {
                mail: req.body.mail
            }
        })
        if (employee) {
            // Si l'utilisateur existe, on compare le mot de passe fourni avec le hash stocké
            if (bcrypt.compareSync(req.body.password,employee.password)) {
                // Si le mot de passe est correct, on stocke l'utilisateur dans la session
                req.session.employee = employee
                // Redirige vers la page d'accueil
                res.redirect('/homepage')
            } else {
                // Si le mot de passe est incorrect, on lève une erreur personnalisée
                throw {password: "mauvais mot de passe"}
            }
        } else {
            // Si l'utilisateur n'existe pas, on lève une erreur personnalisée
            throw {mail: "Cet ustilisateur n'est pas enregistrer"}
        }
    } catch (error) {
        // Affiche les erreurs dans la vue login
        res.render("pages/employeeLogin.twig", {
            error:error
        })
    }
}

// controllers/employeeController.js
exports.displayHome = async (req, res) => {
    try {
        // Assuming the employee is stored in req.session.employee by authGuard
        const employee = req.session.employee;
        res.render('pages/homepage.twig', {
            title: 'Tableau de bord employé',
            employee: employee, // Pass employee data to the template
        });
    } catch (error) {
        res.redirect('/employeeLogin'); // Redirect to login on error
    }
};