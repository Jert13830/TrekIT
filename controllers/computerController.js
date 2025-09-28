const { PrismaClient } = require("../generated/prisma/client")
const prisma = new PrismaClient()

exports.displayAddComputer = (req, res) => {
    res.render("pages/addComputer.twig",{
        company : req.session.company
    })
}

exports.addComputer = async (req, res) => {
    try {
        const computer = await prisma.computer.create({
            data: {
                title: req.body.title,
                author: req.body.author,
                userId: req.session.user.id
            }
        })
        res.redirect("/home")
    } catch (error) {
        res.render("pages/addComputer.twig")
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