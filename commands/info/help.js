const {MessageEmbed} = require("discord.js");
const Index = require("../../index.js");
const config = require("../../config.json");
const Sequelize = require("sequelize");
const AdminCheck = require("../../scripts/admincheck.js");

var isCommandSenderAdmin = false;

module.exports = {
    name: "help",
    description: "Lists all possible commands or info about a specific command.",
    syntax: "help [command]",
    min_args: 0,
    admin_only: false,
    async execute(message, args) {
        isCommandSenderAdmin = await AdminCheck.findOutIfUserIsAdmin(message.author.id);
        var helpEmbed = createCorrectHelpEmbed(message, args);
        message.channel.send(helpEmbed);
    }
};

function createCorrectHelpEmbed(message, args) {
    if(!args.length) {
        return createHelpEmbed("#52ce7b", ":page_facing_up: List of possible commands:", listAllCommands(message), "To learn more about individual commands, use " + config.prefix + "help [command]!");
    }
    else {
        if(doesCommandExist(message, args)) {
            return createHelpEmbed("#499fff", ":ledger: Help for: " + getCommandInstance(args).name, createCommandInfoString(args), "Arguments wrapped with \"<>\" are required, others wrapped with \"[]\" are optional.");
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

function listAllCommands(message) {
    var commandList = "";
    for(const [key, value] of Index.commandMap) {
        var commandObject = Index.commandMap.get(key);
        if(commandObject.admin_only) {
            commandList = listAdminCommandForAdminsOnly(message, commandList, commandObject); //Change = to =+, remove additional "commandList" in function
        }
        else {
            commandList = commandList + "`" + commandObject.name + "`, ";
        }
    }
    commandList = commandList.substr(0, commandList.length - 2);
    return commandList;
}

function listAdminCommandForAdminsOnly(message, commandList, commandObject) {
    if(isCommandSenderAdmin && message.channel.type == "dm") {
        return commandList + "`" + commandObject.name + "`, ";
    }
    return commandList;
}

function doesCommandExist(message, args) {
    if(!Index.commandMap.has(args[0])) {
        return false;
    }
    var commandObject = getCommandInstance(args);
    if(commandObject.admin_only && !isCommandSenderAdmin) {
        return false;
    }
    else {
        return commandObject;
    }
}

function getCommandInstance(args) {
    return Index.commandMap.get(args[0]);
}

function createCommandInfoString(args) {
    var commandObject = getRequestedCommandObject(args);

    return "**Description:** " + commandObject.description + "\n" + "**Syntax:** *" + commandObject.syntax + "*\n" + "**Category:** " + commandObject.category.replace(/^\w/, (c) => c.toUpperCase());
}

function getRequestedCommandObject(args) {
    var requestedCommand = args[0];

    if(Index.commandMap.has(requestedCommand)) {
        return Index.commandMap.get(requestedCommand);
    }
}
