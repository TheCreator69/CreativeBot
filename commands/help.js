module.exports = {
    name: 'help',
    description: "A standard help command! DMs the command sender with a list of possible commands",
    execute(message, args) {
        var helpMessage = "List of possible commands: \n";

        const Index = require("../index.js");
        const commandMap = Index.commandMap;
        for(const [key, value] of commandMap) {
            var commandObject = commandMap.get(key);
            helpMessage = helpMessage.concat(commandObject.name, " - ", commandObject.description, "\n");
        }

        message.author.send(helpMessage);
    }
};
