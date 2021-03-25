module.exports = {
    name: 'help',
    description: "A standard help command! DMs the command sender with a list of possible commands.",
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
        }
        else {
            var requestedCommand = args[0];

            if(commandMap.has(requestedCommand)) {
                var commandObject = commandMap.get(requestedCommand);
                helpMessage = helpMessage.concat("**", commandObject.name, "** - ", commandObject.description, "\n");
            }
            else {
                helpMessage = "Sorry, but this is an invalid command :frowning:";
            }
        }
        message.author.send(helpMessage);
    }
};
