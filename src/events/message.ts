import * as config from "../config.json";
import * as AdminCheck from "../scripts/database/admincheck";
import {commands} from "../index";
import {Message, Client} from "discord.js";
import {EventAttributes} from "../scripts/def/eventdef";
import {CreativeCommand} from "../scripts/def/commanddef";
import * as Localizer from "../scripts/localizer";
import {LogChamp, Category} from "../scripts/logchamp";

var logChampInst = new LogChamp(Category.UserInput);
var logChampProcInst = new LogChamp(Category.TextProcessing);
var logChampCmdInst = new LogChamp(Category.BotMessage);

export var info: EventAttributes = {
    name: "messageCreate",
}

export async function execute(client: Client, message: Message): Promise<void> {
    if(message.content.startsWith(config.prefix) && !message.author.bot) {
        await executeCommandIfPossible(message);
    }
}

interface CommandInfoFromMessage {
    name: string;
    args: string[];
}

async function executeCommandIfPossible(message: Message): Promise<void> {
    logChampInst.debug("Command input detected!", {user: message.author.username});
    var commandInfo = getCommandInfoFromMessage(message);

    if(await canCommandBeExecuted(message, commandInfo)) {
        //@ts-ignore
        var command = getCommandFromNameOrAlias(commandInfo.name);
        if(command === undefined) return;

        if(command.guildOnly) {
            if(!message.guild || !message.guild.available) {
                message.channel.send(Localizer.translate("messageEvent.guildOnlyCommand"));
                logChampProcInst.debug("Guild-only command not sent in available guild!");
                return;
            }
        }

        if(command.minArgs) {
            if(!command.checkRequiredArgs) return;
            var argsCheckResult = await command.checkRequiredArgs(commandInfo.args, message);
            if(argsCheckResult.valid) {
                command.execute(message, commandInfo.args);
                logChampCmdInst.info("Command executed with args!", {args: commandInfo.args});
            }
            else {  //@ts-ignore
                message.channel.send(argsCheckResult.replyMessage);
                logChampCmdInst.info("Invalid command arguments sent!", {replyMessage: argsCheckResult.replyMessage});
            }
        }
        else {
            command.execute(message, commandInfo.args);
            logChampCmdInst.info("Command executed without args!", {args: commandInfo.args});
        }
    }
}

function getCommandInfoFromMessage(message: Message): CommandInfoFromMessage {
    const args = message.content.slice(config.prefix.length).split(/ +/);

    var commandName = args.shift();
    if(commandName === undefined) {
        return {name: "", args: args};
    }
    commandName = commandName.toLowerCase();

    logChampProcInst.debug("Command info extracted from message", {name: commandName, args: args});
    return {name: commandName, args: args};
}

async function canCommandBeExecuted(message: Message, commandInfo: CommandInfoFromMessage): Promise<boolean> {
    //@ts-ignore
    var command = getCommandFromNameOrAlias(commandInfo.name);
    if(command === undefined) return false;

    if(command.adminOnly && !await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
        logChampInst.debug("Non-admin tried to execute admin-only command");
        return false;
    }
    if(commandInfo.args.length < command.minArgs) {
        message.channel.send(Localizer.translate("messageEvent.missingArgs", {prefix: config.prefix, commandName: command.name}));
        logChampInst.debug("Too few command arguments sent");
        return false;
    }
    return true;
}

function getCommandFromNameOrAlias(name: string): CreativeCommand | undefined {
    //@ts-ignore
    return commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
}
