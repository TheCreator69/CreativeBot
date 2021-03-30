const config = require("../config.json");

module.exports = {
    name: "message",
    execute(message, client) {
        if(!message.content.startsWith(config.prefix) || message.author.bot) return;

        const args = message.content.slice(config.prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(client.commands.has(command)) {
            var commandMapEntry = client.commands.get(command);
            commandMapEntry.execute(message, args);
        }
        else {
            message.channel.send("Sorry, but this command is invalid :frowning:");
        }
    }
};
