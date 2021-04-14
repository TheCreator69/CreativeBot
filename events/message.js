const config = require("../config.json");
const Sequelize = require("sequelize");
const AdminCheck = require("../scripts/admincheck.js");

module.exports = {
    name: "message",
    async execute(message, client) {
        if(!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) {
            message.channel.send("Sorry, but this command is invalid :frowning:");
            return;
        }

        var commandMapEntry = client.commands.get(command);
        if(commandMapEntry.admin_only && !await AdminCheck.findOutIfUserIsAdmin(message.author.id)) {
            message.channel.send("Sorry, but this command is invalid :frowning:");
            return;
        }
        if(args.length < commandMapEntry.min_args) {
            message.channel.send("You need to provide the require arguments for the command to work! See `%help " + commandMapEntry.name + "` for details!");
            return;
        }
        commandMapEntry.execute(message, args);
    }
};
