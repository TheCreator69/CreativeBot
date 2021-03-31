const {MessageEmbed} = require("discord.js");
const Index = require("../../index.js");

module.exports = {
    name: "help",
    description: "Lists all possible commands or info about a specific command.",
    syntax: "help [command]",
    execute(message, args) {
        const commandMap = Index.commandMap;
        var helpEmbed = undefined;

        if(!args.length) {
            helpEmbed = createHelpEmbed("List of possible commands:", listAllCommands(commandMap), "To learn more about individual commands, use %help [command]!");
        }
        else {
            if(doesCommandExist(commandMap, args)) {
                helpEmbed = createHelpEmbed("Help for: ", getCommandInfo(commandMap, args), "");
            }
            else {
                helpEmbed = createHelpEmbed("Invalid command!", "Sorry, but this command doesn't exist :frowning:", "");
            }
        }
        message.channel.send(helpEmbed);
    }
};


function doesCommandExist(commandMap, args) {
    return commandMap.has(args[0]);
}

function createHelpEmbed(title, description, footer) {
    var helpEmbed = new MessageEmbed();
    helpEmbed.setColor("#0000ff");
    helpEmbed.setTitle(title);
    helpEmbed.setDescription(description);
    helpEmbed.setFooter(footer);
    return helpEmbed;
}

function listAllCommands(commandMap) {
    var commandList = "";
    for(const [key, value] of commandMap) {
        var commandObject = commandMap.get(key);
        commandList = commandList + "`" + commandObject.name + "`, ";
    }
    commandList = commandList.substr(0, commandList.length - 2);
    return commandList;
}

function getCommandInfo(commandMap, args) {
    var commandInfo = "";
    var commandObject = getRequestedCommandObject(commandMap, args);

    if(commandObject === undefined) {
        commandInfo = "Sorry, but this command doesn't exist :frowning:";
    }
    else {
        commandInfo = commandInfo + "**Description:** " + commandObject.description + "\n" + "**Syntax:** " + commandObject.syntax + "\n" + "**Category:** " + commandObject.category;
    }
    return commandInfo;
}

function getRequestedCommandObject(commandMap, args) {
    var requestedCommand = args[0];

    if(commandMap.has(requestedCommand)) {
        return commandMap.get(requestedCommand);
    }
}
