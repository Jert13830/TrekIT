const { PrismaClient } = require("../generated/prisma/client");
const validateComputer = require("../middleware/extensions/validateEmployeeCompany");
const prisma = new PrismaClient().$extends(validateComputer);

exports.displayAddComputer = (req, res) => {
    res.render("pages/addComputer.twig",{
        company : req.session.company,
        title: "Inscription - Ordinateur",
        error: null,
    })
}

exports.treatComputerList = async (req, res) => {
    const action = req.body.buttons; // "delete-123" or "modify-123"

  if (action.startsWith("delete-")) {
    let toDelete = action.split("-")[1];
    toDelete = parseInt(toDelete );
    // handle delete
   
    try {
        const deleteComputer = await prisma.computer.delete({
            where: {
                id: toDelete
            }
        })
        res.redirect("/computers")
    } catch (error) {
   
        req.session.errorRequest = "Le ordinateur n'a pas pu etre supprimer"
        res.redirect("/computers")

    }



  } else if (action.startsWith("modify-")) {
    const id = action.split("-")[1];
    // handle modify
     console.log("Modify " + id);
  }
};


exports.postComputer = async (req, res) => {
   
    try {
        const computer = await prisma.computer.create({
            data: {
                computerTitle: req.body.computerTitle,
                addressMac: req.body.addressMac,
                purchaseDate: req.body.purchaseDate ? new Date(req.body.purchaseDate) : null,
                status: req.body.status,
                companyId: req.session.company?.id,
            }
        })

        res.redirect("/computers")
    } catch (error) {

        if (error.code === 'P2002') {
      // Unique constraint violation (duplicate MAC address)
      return res.render('pages/addComputer.twig', {
            title: "Inscription - Ordinateur",
            error: null,
            duplicateMAC: "MAC adresse déjà utilisé",
            companyName: req.body.companyName,
            });
        } else{
            
            res.render("pages/addComputer.twig")
        }
    }
}

exports.removeComputer = async (req, res) => {
    try {
        const deleteComputer = await prisma.computer.delete({
            where: {
                id: req.params.id
            }
        })
        res.redirect("/home")
    } catch (error) {
        req.session.errorRequest = "Le livre n'a pas pu etre supprimer"
        res.redirect("/home")

    }
}


exports.displayUpdate = async(req,res)=>{
    const computer = await prisma.computer.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    })
    res.render('pages/addComputer.twig',{
        computer : computer,
        errorRequest: req.session.errorRequest,
        user: req.session.user
    })
}

exports.updateComputer = async(req,res)=>{
    try {
        
        const computerUpdated = await prisma.computer.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                title: req.body.title,
                author: req.body.author
            }
        })
        
        res.redirect("/home")
    } catch (error) {
        req.session.errorRequest = "La modificatiojn du livre a echoué"
        res.redirect("/updateComputer/"+req.params.id)
    }
}