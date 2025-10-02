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
    firstName: null,
    lastName: null,
    email: null,
    password:null,
    confirmPassword: null,
  });
};

exports.treatEmployeeList = async (req, res) => {
    const action = req.body.buttons;

     //Delete the employee
  if (action.startsWith("delete-")) {
    let toDelete = action.split("-")[1];
    toDelete = parseInt(toDelete );
   
    try {
        const deleteEmployee = await prisma.employee.delete({
            where: {
                id: toDelete
            }
        })
        res.redirect("/employees")
    } catch (error) {
        
        req.session.errorRequest = "L'employé n'a pas pu etre supprimer"
        res.redirect("/employees")

    }

    //Modify the employee
  } else if (action.startsWith("modify-")) {
    let toModify = action.split("-")[1];
    toModify = parseInt(toModify);
   
   res.redirect("/updateEmployee/" + toModify)
      
  }
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
    if (req.body.password !== req.body.confirmPassword) {
      return res.render("pages/addEmployee.twig", {
        confirmError: "Mot de passe non correspondant",
      });
    }

    const employee = await prisma.employee.create({
      data: {
        email: req.body.email,
        password: req.body.password, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dob: req.body.dob ? new Date(req.body.dob) : null,
        gender: req.body.gender,
        companyId: req.session.company?.id,
      },
    });

    res.redirect("/employees");
  } catch (error) {
    if (error.code === "P2002") {
      res.render("pages/addEmployee.twig", {
        duplicateEmail: "Email déjà utilisé",
      });
    } else {
      res.render("pages/addEmployee.twig", {
        error: error.message || "Une erreur est survenue",
      });
    }
  }
};

exports.login = async (req,res)=>{
    try {
        // Recherche l'utilisateur en base par son email
        const employee = await prisma.employee.findUnique({
            where: {
                email: req.body.email
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
            throw {email: "Cet ustilisateur n'est pas enregistrer"}
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

exports.updateEmployee = async(req,res)=>{
    try {
          const data = {};

          if (req.body.password && req.body.password.trim() !== "") {
            const hashedPassword = bcrypt.hashSync(req.body.password, 12);
            data.password = hashedPassword;
          }
          
          data.email = req.body.email;
          data.firstName = req.body.firstName;
          data.lastName = req.body.lastName;
          data.dob = req.body.dob ? new Date(req.body.dob) : null,
          data.gender = req.body.gender;
            
          const employeeUpdated = await prisma.employee.update({
            where: {
                id: parseInt(req.params.id)
            },
            data,
            })
          
        
        res.redirect("/employees")
    } 
    catch (error) {
        req.session.errorRequest = "LLa modification apportée à l'employé a echoué"
        //res.redirect("/displayUpdate/"+req.params.id)
        res.redirect("/updateEmployee/"+req.params.id)
    }
}

exports.displayUpdate = async(req,res)=>{
 const modifyEmployee = await prisma.employee.findUnique({
        where: {
                 id: parseInt(req.params.id)
            }
        })

    //set the date of birth to yymmdd
    modifyEmployee.dob= modifyEmployee.dob.toISOString().split("T")[0];        
    
     res.render('pages/addEmployee.twig',{
      employee : modifyEmployee,
      errorRequest: req.session.errorRequest,
      company: req.session.company
    })
}