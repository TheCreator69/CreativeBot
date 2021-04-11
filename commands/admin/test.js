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
            logging: "false"
        });
        try {
            await sequelize.authenticate();
            console.log("Connection successful!");
        }
        catch(error) {
            console.error("Unable to connect: " + error);
        }
    }
};
