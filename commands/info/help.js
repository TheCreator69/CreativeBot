const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Sends a list of possible commands via DMs.",
    syntax: "help [command]",
    execute(message, args) {
        const Index = require("../index.js");
        const commandMap = Index.commandMap;

        var helpMessage = "";
        const helpEmbed = new Discord.MessageEmbed();
        helpEmbed.setColor("#0000ff");

        if(args.length == 0) {
            helpMessage = listAllCommands(commandMap);
            helpMessage = helpMessage.substr(0, helpMessage.length-2);

            helpEmbed.setTitle("List of possible commands:");
            helpEmbed.setDescription(helpMessage);
            helpEmbed.setFooter("To learn more about individual commands, use %help [command]!");
        }
        else {
            helpMessage = displayCommandInfo(commandMap, args);

            commandObject = getRequestedCommandObject(commandMap, args);
            if(commandObject === undefined) {
                helpEmbed.setTitle("Invalid command!");
            }
            else {
                helpEmbed.setTitle("Help for: " + commandObject.name);
            }
            helpEmbed.setDescription(helpMessage);
        }

        message.author.send(helpEmbed);
    }
};


function listAllCommands(commandMap) {
    var commandList = "";
    for(const [key, value] of commandMap) {
        var commandObject = commandMap.get(key);
        commandList = commandList.concat("`", commandObject.name, "`, ");
    }
    return commandList;
}

function displayCommandInfo(commandMap, args) {
    var commandInfo = "";
    var commandObject = getRequestedCommandObject(commandMap, args);

    if(commandObject === undefined) {
        commandInfo = "Sorry, but this command doesn't exist :frowning:";
    }
    else {
        commandInfo = commandInfo.concat("**Description:** ", commandObject.description, "\n", "**Syntax:** ", commandObject.syntax);
    }
    return commandInfo;
}

function getRequestedCommandObject(commandMap, args) {
    var requestedCommand = args[0];

    if(commandMap.has(requestedCommand)) {
        return commandMap.get(requestedCommand);
    }
}
