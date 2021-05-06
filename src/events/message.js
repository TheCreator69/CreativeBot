const config = require("../config.json");
const Sequelize = require("sequelize");
const AdminCheck = require("../scripts/admincheck.js");
const CreditsHandler = require("../scripts/creditshandler.js");

module.exports = {
    name: "message",
    async execute(message, client) {
        if(process.env.NODE_ENV == "production") {
            if(message.content.startsWith(config.prefix) && !message.author.bot) {
                executeCommand(message, client);
            }
            else if(!message.author.bot) {
                await handleCreativeCredits(message);
            }
        }
        else if(process.env.NODE_ENV == "development") {
            if(message.content.startsWith(config.prefix) && !message.author.bot && await AdminCheck.checkIfUserIsAdmin(message.author.id)) {
                executeCommand(message, client);
            }
        }
    }
};

async function handleCreativeCredits(message) {
    CreditsHandler.incrementCreditsForUser(message.author.id, 5);
}

async function executeCommand(message, client) {
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) {
        return;
    }
    var commandMapEntry = client.commands.get(command);
    if(commandMapEntry.admin_only && !await AdminCheck.checkIfUserIsAdmin(message.author.id)) {
        return;
    }
    if(args.length < commandMapEntry.min_args) {
        message.channel.send("You need to provide the required arguments for the command to work! See `" + config.prefix + "help " + commandMapEntry.name + "` for details!");
        return;
    }
    commandMapEntry.execute(message, args);
}
