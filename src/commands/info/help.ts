import {MessageEmbed, Message, Collection, ColorResolvable} from "discord.js";
import * as config from "../../config.json";
import * as AdminCheck from "../../scripts/database/admincheck";
import {CreativeCommand} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import {createStringFromArrayWithSeparator} from "../../scripts/uifunctions";
import {LogChamp, Category} from "../../scripts/logchamp";

var logChampInst = new LogChamp(Category.TextProcessing);

export class HelpCommand implements CreativeCommand {
    constructor(_commandCollection: Collection<string, CreativeCommand>) {
        this.commandCollection = _commandCollection;
    }

    name = Localizer.translate("help.name");
    aliases = Localizer.translateArray("help.aliases");
    description = Localizer.translate("help.description");
    syntax = Localizer.translate("help.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    isCommandSenderAdmin = false;
    commandCollection: Collection<string, CreativeCommand>;

    async execute(message: Message, args: string[]): Promise<void> {
        this.isCommandSenderAdmin = await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id));
        var helpEmbed = this.createCorrectHelpEmbed(message, args);
        //@ts-ignore
        message.channel.send({embeds: [helpEmbed]});
    }

    createCorrectHelpEmbed(message: Message, args: string[]): MessageEmbed {
        if(!args.length) {
            logChampInst.debug("Constructed help embed with command list");
            return this.createHelpEmbed(
                "#52ce7b",
                Localizer.translate("help.commandListTitle"),
                this.listAllCommandsAlphabetically(message),
                Localizer.translate("help.commandListFooter", {prefix: config.prefix})
            );
        }
        else {
            if(this.doesCommandExistForAuthor(args)) {
                logChampInst.debug("Constructed help embed for specific command");
                return this.createHelpEmbed(
                    "#499fff",
                    // @ts-ignore
                    Localizer.translate("help.commandDetailsTitle", {commandName: this.getCommandInstance(args).name}),
                    this.createCommandInfoString(args),
                    Localizer.translate("help.commandDetailsFooter")
                );
            }
            else {
                logChampInst.debug("Constructed help embed for unknown command");
                return this.createHelpEmbed(
                    "#ff0000",
                    Localizer.translate("help.invalidCommandTitle"),
                    Localizer.translate("help.invalidCommandDescription"),
                    ""
                );
            }
        }
    }

    createHelpEmbed(colorInHex: ColorResolvable, title: string, description: string, footer: string): MessageEmbed {
        var helpEmbed = new MessageEmbed();
        helpEmbed.setColor(colorInHex);
        helpEmbed.setTitle(title);
        helpEmbed.setDescription(description);
        helpEmbed.setFooter(footer);
        return helpEmbed;
    }

    listAllCommandsAlphabetically(message: Message): string {
        var commands = this.sortCommandsAlphabetically(Array.from(this.commandCollection.values()));
        var commandList = "";
        for(const commandObject of commands) {
            if(commandObject.adminOnly) {
                commandList += this.listAdminCommandForAdminsOnlyInDM(message, commandObject);
            }
            else {
                logChampInst.debug("Command added to list");
                commandList += "`" + commandObject.name + "`, ";
            }
        }
        commandList = commandList.substr(0, commandList.length -2);

        logChampInst.debug("Command list string constructed", {commandList: commandList});
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
        //@ts-ignore
        if(this.isCommandSenderAdmin && message.channel.type == "DM") {
            logChampInst.debug("Admin-only command added to list for admin in DM");
            return "`" + commandObject.name + "`, ";
        }
        logChampInst.debug("Admin-only command not added to list", {isAdmin: this.isCommandSenderAdmin, channelType: message.channel.type});
        return "";
    }

    doesCommandExistForAuthor(args: string[]): boolean {
        var commandObject = this.getCommandInstance(args);
        if(commandObject === undefined) {
            logChampInst.debug("Command does not exist");
            return false;
        }
        if(commandObject.adminOnly && !this.isCommandSenderAdmin) {
            logChampInst.debug("Non-admin tried to access admin-only command");
            return false;
        }
        else {
            logChampInst.debug("Command visible for author");
            return true;
        }
    }

    createCommandInfoString(args: string[]): string {
        var commandObject = this.getCommandInstance(args);
        //@ts-ignore
        var category = commandObject.category.replace(/^\w/, (c: any) => c.toUpperCase());

        var aliases;
        if(commandObject?.aliases === undefined) aliases = "None.";
        else aliases = createStringFromArrayWithSeparator(commandObject?.aliases, 0, ", ");

        logChampInst.debug("Command info string created");
        //@ts-ignore
        return Localizer.translate("help.commandInfoString", {aliases: aliases, description: commandObject.description, prefix: config.prefix, syntax: commandObject.syntax, category: category});
    }

    getCommandInstance(args: string[]): CreativeCommand | undefined {
        //@ts-ignore
        return this.commandCollection.get(args[0]) || this.commandCollection.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
    }
}
