const Sequelize = require("sequelize");

module.exports = {
    name: "test",
    description: "Dummy test command to test functionality in a clean js file.",
    syntax: "test",
    min_args: 0,
    admin_only: true,
    async execute(message, args) {
        const sequelize = new Sequelize("***REMOVED***", "***REMOVED***", "***REMOVED***", {
            host: "localhost",
            dialect: "mysql",
            logging: false
        });
        const Admins = sequelize.define("admins", {
            id: {
                type: Sequelize.BIGINT,
                primaryKey: true
            }
        }, {
            timestamps: false
        });
        await Admins.sync();
        const adminEntry = await Admins.findOne({where: {id: message.author.id}});
        if(adminEntry === null) {
            console.log("Couldn't find ID in database!");
        }
        else {
            console.log("Found ID in database!");
        }
    }
};
