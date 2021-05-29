import {MessageEmbed, Message, Collection} from "discord.js";
import * as Index from "../../index";
import * as config from "../../config.json";
import * as AdminCheck from "../../scripts/admincheck";
import {CreativeCommand} from "../../scripts/commanddef";

export class Command implements CreativeCommand {
    constructor(_commandCollection?: Collection<string, CreativeCommand>) {
        if(_commandCollection !== undefined) this.commandCollection = _commandCollection;
        else this.commandCollection = Index.commands;
    }

    name = "help";
    description = "Lists all possible commands or info about a specific command if one is specified";
    syntax = "help [command]";
    min_args = 0;
    admin_only = false;

    isCommandSenderAdmin = false;
    commandCollection: Collection<string, CreativeCommand>;

    async execute(message: Message, args: string[]): Promise<void> {
        this.isCommandSenderAdmin = await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id));
        var helpEmbed = this.createCorrectHelpEmbed(message, args);
        message.channel.send(helpEmbed);
    }

    createCorrectHelpEmbed(message: Message, args: string[]): MessageEmbed {
        if(!args.length) {
            return this.createHelpEmbed("#52ce7b",
            ":page_facing_up: List of possible commands:",
            this.listAllCommandsAlphabetically(message),
            "To learn more about individual commands, use " + config.prefix + "help [command]!");
        }
        else {
            if(this.doesCommandExist(args)) {
                return this.createHelpEmbed("#499fff",
                // @ts-ignore
                ":ledger: Help for: " + this.getCommandInstance(args).name,
                this.createCommandInfoString(args),
                "Arguments wrapped with \"<>\" are required, others wrapped with \"[]\" are optional.");
            }
            else {
                return this.createHelpEmbed("#ff0000",
                ":interrobang: Invalid command!",
                "Sorry, but this command doesn't exist :frowning:");
            }
        }
    }

    createHelpEmbed(colorInHex: string, title: string, description: string, footer?: string): MessageEmbed {
        var helpEmbed = new MessageEmbed();
        helpEmbed.setColor(colorInHex);
        helpEmbed.setTitle(title);
        helpEmbed.setDescription(description);
        helpEmbed.setFooter(footer);
        return helpEmbed;
    }

    listAllCommandsAlphabetically(message: Message): string {
        var commands = this.sortCommandsAlphabetically(this.commandCollection.array());
        var commandList = "";
        for(const commandObject of commands) {
            if(commandObject.admin_only) {
                commandList += this.listAdminCommandForAdminsOnlyInDM(message, commandObject);
            }
            else {
                commandList += "`" + commandObject.name + "`, ";
            }
        }
        commandList = commandList.substr(0, commandList.length - 2);
        return commandList;
    }

    sortCommandsAlphabetically(array: CreativeCommand[]): CreativeCommand[] {
        return array.sort(function(a, b) {
            if(a.name < b.name) {
                return -1;
            }
            else if(a.name > b.name) {
                return 1;
            }
            return 0;
        });
    }

    listAdminCommandForAdminsOnlyInDM(message: Message, commandObject: CreativeCommand): string {
        if(this.isCommandSenderAdmin && message.channel.type == "dm") {
            return "`" + commandObject.name + "`, ";
        }
        return "";
    }

    doesCommandExist(args: string[]): boolean {
        var commandObject = this.getCommandInstance(args);
        if(commandObject === undefined) {
            return false;
        }
        if(commandObject.admin_only && !this.isCommandSenderAdmin) {
            return false;
        }
        else {
            return true;
        }
    }

    getCommandInstance(args: string[]): CreativeCommand | undefined {
        return this.commandCollection.get(args[0]);
    }

    createCommandInfoString(args: string[]): string {
        var commandObject = this.getRequestedCommandObject(args);
        // @ts-ignore
        return "**Description:** " + commandObject.description + "\n" + "**Syntax:** *" + config.prefix + commandObject.syntax + "*\n" + "**Category:** " + commandObject.category.replace(/^\w/, (c: any) => c.toUpperCase());
    }

    getRequestedCommandObject(args: string[]): CreativeCommand | undefined {
        var requestedCommand = args[0];

        if(this.commandCollection.has(requestedCommand)) {
            return this.commandCollection.get(requestedCommand);
        }
        return;
    }

}
