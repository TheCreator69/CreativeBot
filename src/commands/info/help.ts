import {MessageEmbed, Message} from "discord.js";
import * as Index from "../../index";
import * as config from "../../config.json";
import * as AdminCheck from "../../scripts/admincheck";
import {CreativeCommandAttributes} from "../../scripts/commanddef";

var isCommandSenderAdmin = false;

export var info: CreativeCommandAttributes = {
    name: "help",
    description: "Lists all possible commands or info about a specific command if one is specified.",
    syntax: "help [command]",
    min_args: 0,
    admin_only: false,
}

export async function execute(message: Message, args: string[]): Promise<void> {
    isCommandSenderAdmin = await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id));
    var helpEmbed = createCorrectHelpEmbed(message, args);
    message.channel.send(helpEmbed);
}

function createCorrectHelpEmbed(message: Message, args: string[]): MessageEmbed {
    if(!args.length) {
        return createHelpEmbed("#52ce7b",
        ":page_facing_up: List of possible commands:",
        listAllCommandsAlphabetically(message),
        "To learn more about individual commands, use " + config.prefix + "help [command]!");
    }
    else {
        if(doesCommandExist(args)) {
            return createHelpEmbed("#499fff",
            ":ledger: Help for: " + getCommandInstance(args).info.name,
            createCommandInfoString(args),
            "Arguments wrapped with \"<>\" are required, others wrapped with \"[]\" are optional.");
        }
        else {
            return createHelpEmbed("#ff0000",
            ":interrobang: Invalid command!",
            "Sorry, but this command doesn't exist :frowning:");
        }
    }
}

function createHelpEmbed(colorInHex: string, title: string, description: string, footer?: string): MessageEmbed {
    var helpEmbed = new MessageEmbed();
    helpEmbed.setColor(colorInHex);
    helpEmbed.setTitle(title);
    helpEmbed.setDescription(description);
    helpEmbed.setFooter(footer);
    return helpEmbed;
}

function listAllCommandsAlphabetically(message: Message): string {
    var commands = sortCommandsAlphabetically(Index.commands.array());
    var commandList = "";
    for(const commandObject of commands) {
        if(commandObject.info.admin_only) {
            commandList += listAdminCommandForAdminsOnlyInDM(message, commandObject);
        }
        else {
            commandList += "`" + commandObject.info.name + "`, ";
        }
    }
    commandList = commandList.substr(0, commandList.length - 2);
    return commandList;
}

function sortCommandsAlphabetically(commands: any[]): any[] {
    return commands.sort(function(a, b) {
        if(a.info.name < b.info.name) {
            return -1;
        }
        else if(a.info.name > b.info.name) {
            return 1;
        }
        return 0;
    });
}

function listAdminCommandForAdminsOnlyInDM(message: Message, commandObject: any): string {
    if(isCommandSenderAdmin && message.channel.type == "dm") {
        return "`" + commandObject.info.name + "`, ";
    }
    return "";
}

function doesCommandExist(args: string[]): boolean {
    if(!Index.commands.has(args[0])) {
        return false;
    }
    var commandObject = getCommandInstance(args);
    if(commandObject.info.admin_only && !isCommandSenderAdmin) {
        return false;
    }
    else {
        return commandObject;
    }
}

function getCommandInstance(args: string[]): any {
    return Index.commands.get(args[0]);
}

function createCommandInfoString(args: string[]): string {
    var commandObject = getRequestedCommandObject(args);

    return "**Description:** " + commandObject.info.description + "\n" + "**Syntax:** *" + config.prefix + commandObject.info.syntax + "*\n" + "**Category:** " + commandObject.info.category.replace(/^\w/, (c: any) => c.toUpperCase());
}

function getRequestedCommandObject(args: string[]): any {
    var requestedCommand = args[0];

    if(Index.commands.has(requestedCommand)) {
        return Index.commands.get(requestedCommand);
    }
}
