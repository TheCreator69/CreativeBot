const config = require("../config.json");
const Sequelize = require("sequelize");
const AdminCheck = require("../scripts/admincheck.js");
const CreditsHandler = require("../scripts/creditshandler.js");
const invalidCommandMessage = "Sorry, but this command is invalid :frowning:";

module.exports = {
    name: "message",
    async execute(message, client) {
        if(!message.content.startsWith(config.prefix) || message.author.bot) {
            await handleCreativeCredits(message);
            return;
        }

        executeCommand(message, client);
    }
};

async function handleCreativeCredits(message) {
    CreditsHandler.incrementCreditsForUser(message.author.id, 5);
}

async function executeCommand(message, client) {
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) {
        message.channel.send(invalidCommandMessage);
        return;
    }
    var commandMapEntry = client.commands.get(command);
    if(commandMapEntry.admin_only && !await AdminCheck.findOutIfUserIsAdmin(message.author.id)) {
        message.channel.send(invalidCommandMessage);
        return;
    }
    if(args.length < commandMapEntry.min_args) {
        message.channel.send("You need to provide the required arguments for the command to work! See `" + config.prefix + "help " + commandMapEntry.name + "` for details!");
        return;
    }
    commandMapEntry.execute(message, args);
}
