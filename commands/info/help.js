const {MessageEmbed} = require("discord.js");
const Index = require("../../index.js");

module.exports = {
    name: "help",
    description: "Lists all possible commands or info about a specific command.",
    syntax: "help [command]",
    execute(message, args) {
        var helpEmbed = createCorrectHelpEmbed(Index.commandMap, args);
        message.channel.send(helpEmbed);
    }
};


function createCorrectHelpEmbed(commandMap, args) {
    if(!args.length) {
        return createHelpEmbed("#52ce7b", ":page_facing_up: List of possible commands:", listAllCommands(commandMap), "To learn more about individual commands, use %help [command]!");
    }
    else {
        if(doesCommandExist(commandMap, args)) {
            return createHelpEmbed("#499fff", ":ledger: Help for: " + getCommandInstance(commandMap, args).name, createCommandInfoString(commandMap, args), "");
        }
        else {
            return createHelpEmbed("#ff0000", ":interrobang: Invalid command!", "Sorry, but this command doesn't exist :frowning:", "");
        }
    }
}

function createHelpEmbed(color, title, description, footer) {
    var helpEmbed = new MessageEmbed();
    helpEmbed.setColor(color);
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

function doesCommandExist(commandMap, args) {
    return commandMap.has(args[0]);
}

function getCommandInstance(commandMap, args) {
    return commandMap.get(args[0]);
}

function createCommandInfoString(commandMap, args) {
    var commandObject = getRequestedCommandObject(commandMap, args);

    return "**Description:** " + commandObject.description + "\n" + "**Syntax:** *" + commandObject.syntax + "*\n" + "**Category:** " + commandObject.category.replace(/^\w/, (c) => c.toUpperCase());
}

function getRequestedCommandObject(commandMap, args) {
    var requestedCommand = args[0];

    if(commandMap.has(requestedCommand)) {
        return commandMap.get(requestedCommand);
    }
}
