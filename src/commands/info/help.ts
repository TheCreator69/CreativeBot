import {MessageEmbed} from "discord.js";
import * as Index from "../../index";
import * as config from "../../config.json";
import * as AdminCheck from "../../scripts/admincheck";

var isCommandSenderAdmin = false;

module.exports = {
    name: "help",
    description: "Lists all possible commands or info about a specific command.",
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
        return createHelpEmbed("#52ce7b", ":page_facing_up: List of possible commands:", listAllCommands(message), "To learn more about individual commands, use " + config.prefix + "help [command]!");
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

function listAllCommands(message: any) {
    var commandList = "";
    for(const commandObject of Index.commandMap.values()) {
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

function listAdminCommandForAdminsOnly(message: any, commandList: string, commandObject: any) {
    if(isCommandSenderAdmin && message.channel.type == "dm") {
        return commandList + "`" + commandObject.name + "`, ";
    }
    return commandList;
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

    return "**Description:** " + commandObject.description + "\n" + "**Syntax:** *" + commandObject.syntax + "*\n" + "**Category:** " + commandObject.category.replace(/^\w/, (c: any) => c.toUpperCase());
}

function getRequestedCommandObject(args: string[]) {
    var requestedCommand = args[0];

    if(Index.commandMap.has(requestedCommand)) {
        return Index.commandMap.get(requestedCommand);
    }
}
