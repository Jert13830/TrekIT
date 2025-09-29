const {Prisma} = require('@prisma/client');
const bcrypt = require('bcrypt');

module.exports = Prisma.defineExtension({
    name: "hashPasswordExtension",
    query: {
        $allModels: {
            create : async ({args,query})=>{
                const hashedPassword = bcrypt.hashSync(args.data.password, 12);
                args.data.password = hashedPassword;
                return query(args);
            }
        }
    }
})