// Import PrismaClient from Prisma general client
const { PrismaClient } = require("../../generated/prisma/client")
// On instancie PrismaClient pour interagir avec la base de données
const prisma = new PrismaClient()

/**
 * Middleware d'authentification pour protéger les routes.
 * Vérifie si l'utilisateur est connecté (présent dans la session)
 * et existe bien en base de données.
 */
const authguard = async (req, res, next) => {
    try {
        // check if the session contains a company.
        if (req.session.company) {
            // Searches for the company in the database using their ID stored in the session.
            const company = await prisma.company.findUnique({
                where: {
                    id: req.session.company.id
                }
            })
            // if the company exists move to next query
            if (company) {
                return next()
            }
        }
        // If no company is logged in or not found in the database, an error is raised.
        throw new Error("Entreprise non connecté")
    } catch (error) {
        // If there is an error the user is sent to the Login page
        res.redirect('/login')
        
    }
}

// We export the middleware to use it in routes.
module.exports = authguard