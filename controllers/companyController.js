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
    if (req.body.password == req.body.confirmPassword) {
      
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
        console.log("Everything OK");
        res.redirect('/login');
    }
    else {
      console.log("Mismatch email");
      const error = new Error("Mot de passe non correspondant");
      error.confirmPassword = error.message; // Match template field name
      throw error;
    }

  } catch (error) {
   
    if (error.code === 'P2002') {
      console.log("Siret exists");
      // Unique constraint violation (duplicate SIRET)
      return res.render('pages/companySubscribe.twig', {
        title: "Inscription - Entreprise",
        error: null,
        duplicateSiret: "Siret déjà utilisé",
        companyName: req.body.companyName,
        directorName: req.body.directorName,
        confirmPassword: req.body.confirmPassword,
      })
      
    } 
    else 
      {
        console.log("Another error");
      // Other errors (validation or password mismatch)
      const errorDetails = "Mot de passe non correspondant"
      
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
            },
            include : {
              employees : true,
              computers: true
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
                throw {password: "Mauvais mot de passe"}
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
        //const company = req.session.company;

const company = await prisma.company.findUnique({
             where: { id: req.session.company.id },
             include: { employees: true,
              computers: { 
                    include: { 
                    faults: { 
                         where: { faultEndDate: null }
                        } 
                      }
                    }
                  }
        });

        res.render('pages/dashboard.twig', {
            title: 'Tableau de bord',
            company: company, // Pass company data to the template
        });
    } catch (error) {
        //
        res.redirect('/login'); // Redirect to login on error
    }
};


exports.displayEmployees = async (req, res) => {
    try {
       

    /*   const company = await prisma.company.findUnique({
             where: { id: req.session.company.id },
             include: { employees: true, computers: true },
        });*/

       const company = await prisma.company.findUnique({
          where: { id: req.session.company.id },
          include: {
            employees: {
              include: {
                computer: true, // each employee gets their computer object (or null)
              },
            },
          },
        });
        
       res.render('pages/listEmployees.twig', {
            title: 'Liste des employés',
            company: company, // Pass company data to the template
        });
    } catch (error) {
        console.error('Liste des employés error:', error);
        res.redirect('/dashboard'); // Redirect to dashboard on error
    }
};

exports.displayComputers = async (req, res) => {
    try {
        //const company = req.session.company;

        const company = await prisma.company.findUnique({
             where: { id: req.session.company.id },
             include: { employees: true, computers: true },
        });

        res.render('pages/listComputers.twig', {
            title: 'Liste des ordinateurs',
            company: company, // Pass company data to the template
        });
    } catch (error) {
        console.error('Liste des ordinateurs error:', error);
        res.redirect('/dashboard'); // Redirect to dashboard on error
    }
};

// Déconnecte l'entreprise en détruisant la session et redirige vers la page de connexion
exports.logout = async (req,res)=>{
    req.session.destroy()
    res.redirect('/login')
}

exports.displayUpdateCompany = async(req,res)=>{

const modifyCompany = await prisma.company.findUnique({
        where: {
                 id: parseInt( req.session.company.id)
            }
        })
     res.render('pages/companySubscribe.twig',{
      company : modifyCompany,
      errorRequest: req.session.errorRequest,
    })

}

exports.updateCompany = async(req,res)=>{
    try {
          const data = {};

          if (req.body.password && req.body.password.trim() !== "") {

              if (req.body.password !== req.body.confirmPassword) {
              
                  return  res.redirect("/updateCompany/"+req.params.id, {
                  confirmPassword: "Mot de passe non correspondant"});
              }
              else {
                     const hashedPassword = bcrypt.hashSync(req.body.password, 12);
                     data.password = hashedPassword;
              }

          }
         
             data.companyName = req.body.companyName;
             data.siret = req.body.siret;
             data.directorName = req.body.directorName;
          

        const companyUpdated = await prisma.company.update({
            where: {
                id: parseInt(req.params.id)
            },
            data,
            })
        
       res.render('pages/dashboard.twig', {
            title: 'Tableau de bord',
            company:req.session.company, // Pass company data to the template
        });
    } catch (error) {

        if (error.code === 'P2002') {
          req.session.errorRequest = "Siret déjà utiliséT"

         } else {
          req.session.errorRequest = "La modification du profil de l'entreprise n'a pas abouti."
         }
            res.redirect("/updateCompany")
    }
}

exports.displayComputerFaults = async (req, res) => {
  
  try {
    const company = await prisma.company.findUnique({
    where: { id: req.session.company.id },
    include: { 
      computers: { 
        include: { 
          faults: { 
            where: { faultEndDate: null }
          } 
        } 
      }
    }
  });

    res.render('pages/listFaults.twig', {
      title: 'Liste des pannes informatiques',
      company: company,
      computers: company.computers
    });

  } catch (error) {
    console.error('Liste des pannes informatiques:', error);
    res.redirect('/dashboard');
  }
};

exports.resolveComputerFaults = async (req, res) => {
    const action = req.body.buttons; 

  if (action.startsWith("solved-")) {
    let toModify = action.split("-")[1];
    toModify = parseInt(toModify );
   
    const data = {}

    data.faultEndDate = new Date(),
    data.cost = req.body.repairCost;

    try {
        const faultEnd = await prisma.fault.update({
            where: {
                id: toModify
            },
            data 
        })
       
         res.redirect("/showCompanyFaults")

    } catch (error) {
   
        req.session.errorRequest = "La panne n'a pu être corrigée."
        res.redirect("/showCompanyFaults")

    }
  }
}

exports.displayReports= async (req, res) => {
    try {
            const company = await prisma.company.findUnique({
             where: { id: req.session.company.id },
             include: { employees: true,
              computers: { 
                    include: { 
                    faults: true,
                      }
                    }
                  }
        });

    

        res.render('pages/reports.twig', {
            title: 'Compte rendu',
            company: company, // Pass company data to the template
        });
    } catch (error) {
        //
        res.redirect('/dashboard'); // Redirect to dashboard on error
    }
};
