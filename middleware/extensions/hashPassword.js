const {Prisma} = require('@prisma/client');
const bcrypt = require('bcrypt');

module.exports = Prisma.defineExtension({
    name: "hashPasswordExtension",
    query: {
        computer: {
            create: async ({ args, query }) => {
                if (!args.data.password) {
                    throw new Error("Password is required");
                }
                const hashedPassword = bcrypt.hashSync(args.data.password, 12);
                args.data.password = hashedPassword;
                return query(args);
            }
        },
        company: {
            create: async ({ args, query }) => {
                if (!args.data.password) {
                    throw new Error("Password is required");
                }
                const hashedPassword = bcrypt.hashSync(args.data.password, 12);
                args.data.password = hashedPassword;
                return query(args);
            }
        },

        employee: {
            create: async ({ args, query }) => {
                if (!args.data.password) {
                    throw new Error("Password is required");
                }
                const hashedPassword = bcrypt.hashSync(args.data.password, 12);
                args.data.password = hashedPassword;
                return query(args);
            }
        }
    }
})