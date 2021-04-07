const {MessageEmbed} = require("discord.js");
const Index = require("../../index.js");
const config = require("../../config.json");

module.exports = {
    name: "help",
    description: "Lists all possible commands or info about a specific command.",
    syntax: "help [command]",
    admin_only: false,
    execute(message, args) {
        var helpEmbed = createCorrectHelpEmbed(message, Index.commandMap, args);
        message.channel.send(helpEmbed);
    }
};


function createCorrectHelpEmbed(message, commandMap, args) {
    if(!args.length) {
        return createHelpEmbed("#52ce7b", ":page_facing_up: List of possible commands:", listAllCommands(message, commandMap), "To learn more about individual commands, use %help [command]!");
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

function listAllCommands(message, commandMap) {
    var commandList = "";
    for(const [key, value] of commandMap) {
        var commandObject = commandMap.get(key);
        if(commandObject.admin_only) {
            commandList = listAdminCommandForAdminsOnly(message, commandList, commandObject);
        }
        else {
            commandList = commandList + "`" + commandObject.name + "`, ";
        }
    }
    commandList = commandList.substr(0, commandList.length - 2);
    return commandList;
}

function listAdminCommandForAdminsOnly(message, commandList, commandObject) {
    if(isCommandSenderAdmin(message) && message.channel.type == "dm") {
        return commandList + "`" + commandObject.name + "`, ";
    }
    return commandList;
}

function isCommandSenderAdmin(message) {
    for(let i in config.admin_ids) {
        if(config.admin_ids[i] == message.author.id) {
            return true;
        }
    }
    return false;
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
