const {Prisma} = require('@prisma/client');
const bcrypt = require('bcrypt');

module.exports = Prisma.defineExtension({
    name: "comapnyValidateExtension",
    query: {
        company: {
            create : async ({args,query})=>{
               const errors = {};

               if(!/^\d{3}\s?\d{3}\s?\d{3}\s?\d{5}$/.test(args.data.siret)){
                    errors.siret = "Siret invalide";
               }

                if(!/^[A-Za-zÀ-ÿ0-9\s'’&-().]+$/.test(args.data.companyName)){
                    errors.companyName = "Nom de l'entreprise non valide";
               }

               if(!/^(?=.*?[0-9])(?=.*?[A-Za-z]).{6,}$/.test(args.data.password)){
                    errors.password = "6 caractères minimum, comprenant au moins une lettre (A-Za-z)";
               }

              if (Object.keys(errors).length > 0 ){
                const error = new Error("Validation error");
                error.details = errors;
                throw error;
              } 

              return query(args);
            }
        }
    }
})