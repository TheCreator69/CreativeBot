module.exports = {
    name: "help",
    description: "Sends a list of possible commands via DMs.",
    syntax: "help [command]",
    execute(message, args) {
        const Index = require("../index.js");
        const commandMap = Index.commandMap;
        var helpMessage = "";

        if(args.length == 0) {
            helpMessage = "**List of possible commands:** \n";

            for(const [key, value] of commandMap) {
                var commandObject = commandMap.get(key);
                helpMessage = helpMessage.concat("**", commandObject.name, "** - ", commandObject.description, "\n");
            }
            helpMessage = helpMessage.concat("\n", "To __learn more__ about individual commands, use *%help [command]!*");
        }
        else {
            var requestedCommand = args[0];

            if(commandMap.has(requestedCommand)) {
                var commandObject = commandMap.get(requestedCommand);
                helpMessage = helpMessage.concat("**", commandObject.syntax, "** - ", commandObject.description, "\n");
            }
            else {
                helpMessage = "Sorry, but this command is invalid :frowning:";
            }
        }
        message.author.send(helpMessage);
    }
};
