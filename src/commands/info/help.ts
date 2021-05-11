import {MessageEmbed} from "discord.js";
import * as Index from "../../index";
import * as config from "../../config.json";
import * as AdminCheck from "../../scripts/admincheck";

var isCommandSenderAdmin = false;

module.exports = {
    name: "help",
    description: "Lists all possible commands or info about a specific command if one is specified.",
    syntax: "help [command]",
    min_args: 0,
    admin_only: false,
    async execute(message: any, args: string[]) {
        isCommandSenderAdmin = await AdminCheck.checkIfUserIsAdmin(message.author.id);
        var helpEmbed = createCorrectHelpEmbed(message, args);
        message.channel.send(helpEmbed);
    }
};

function createCorrectHelpEmbed(message: any, args: string[]) {
    if(!args.length) {
        return createHelpEmbed("#52ce7b", ":page_facing_up: List of possible commands:", listAllCommandsAlphabetically(message), "To learn more about individual commands, use " + config.prefix + "help [command]!");
    }
    else {
        if(doesCommandExist(args)) {
            return createHelpEmbed("#499fff", ":ledger: Help for: " + getCommandInstance(args).name, createCommandInfoString(args), "Arguments wrapped with \"<>\" are required, others wrapped with \"[]\" are optional.");
        }
        else {
            return createHelpEmbed("#ff0000", ":interrobang: Invalid command!", "Sorry, but this command doesn't exist :frowning:", "");
        }
    }
}

function createHelpEmbed(color: string, title: string, description: string, footer: string) {
    var helpEmbed = new MessageEmbed();
    helpEmbed.setColor(color);
    helpEmbed.setTitle(title);
    helpEmbed.setDescription(description);
    helpEmbed.setFooter(footer);
    return helpEmbed;
}

function listAllCommandsAlphabetically(message: any) {
    var commandList = "";
    var commands = Index.commandMap.array();
    commands.sort(function(a, b) {
        if(a.name < b.name) {
            return -1;
        }
        else if(a.name > b.name) {
            return 1;
        }
        return 0;
    });
    for(const commandObject of commands) {
        if(commandObject.admin_only) {
            commandList += listAdminCommandForAdminsOnlyInDM(message, commandObject);
        }
        else {
            commandList += "`" + commandObject.name + "`, ";
        }
    }
    commandList = commandList.substr(0, commandList.length - 2);
    return commandList;
}

function listAdminCommandForAdminsOnlyInDM(message: any, commandObject: any) {
    if(isCommandSenderAdmin && message.channel.type == "dm") {
        return "`" + commandObject.name + "`, ";
    }
    return "";
}

function doesCommandExist(args: string[]) {
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

function getCommandInstance(args: string[]) {
    return Index.commandMap.get(args[0]);
}

function createCommandInfoString(args: string[]) {
    var commandObject = getRequestedCommandObject(args);

    return "**Description:** " + commandObject.description + "\n" + "**Syntax:** *" + config.prefix + commandObject.syntax + "*\n" + "**Category:** " + commandObject.category.replace(/^\w/, (c: any) => c.toUpperCase());
}

function getRequestedCommandObject(args: string[]) {
    var requestedCommand = args[0];

    if(Index.commandMap.has(requestedCommand)) {
        return Index.commandMap.get(requestedCommand);
    }
}
