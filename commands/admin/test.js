const Sequelize = require("sequelize");
const AdminScript = require("../../scripts/admincheck.js");

module.exports = {
    name: "test",
    description: "Dummy test command to test functionality in a clean js file.",
    syntax: "test",
    min_args: 0,
    admin_only: true,
    async execute(message, args) {
        await testAdminScript(message);
        //testCredits(message, args);
    }
};

async function testAdminScript(message) {
    var isUserAdmin = await AdminScript.findOutIfUserIsAdmin(message.author.id);
    console.log(isUserAdmin);
}

async function testCredits(message, args) {
    const sequelize = new Sequelize("***REMOVED***", "***REMOVED***", "***REMOVED***", {
        host: "localhost",
        dialect: "mysql",
        logging: false
    });
    const Credits = sequelize.define("credits", {
        userID: {
            type: Sequelize.BIGINT,
            primaryKey: true
        },
        credits : {
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false
    });
    await Credits.sync();
    const userEntry = await Credits.findOne({where: {userID: message.author.id}});
    if(userEntry === null) {
        console.log("Couldn't find ID in database! Creating new entry...");
        var newUserEntry = await Credits.create({userID: message.author.id, credits: 0});
    }
    else {
        console.log("Found ID in database! Your credits are currently: " + userEntry.credits);
    }
}
