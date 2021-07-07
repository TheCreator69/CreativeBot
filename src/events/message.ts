import * as config from "../config.json";
import * as AdminCheck from "../scripts/database/admincheck";
import {commands} from "../index";
import {Message, Client} from "discord.js";
import {EventAttributes} from "../scripts/def/eventdef";
import {CreativeCommand} from "../scripts/def/commanddef";
import * as Localizer from "../scripts/localizer";

export var info: EventAttributes = {
    name: "message",
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
    var commandInfo = getCommandInfoFromMessage(message);

    if(await canCommandBeExecuted(message, commandInfo)) {
        //@ts-ignore
        var command = getCommandFromNameOrAlias(commandInfo.name);
        if(command === undefined) return;

        if(command.guildOnly) {
            if(!message.guild || !message.guild.available) {
                message.channel.send(Localizer.translate("messageEvent.guildOnlyCommand"));
                return;
            }
        }

        if(command.minArgs) {
            if(!command.checkRequiredArgs) return;
            var argsCheckResult = await command.checkRequiredArgs(commandInfo.args, message);
            if(argsCheckResult.valid) {
                command.execute(message, commandInfo.args);
            }
            else {  //@ts-ignore
                message.channel.send(argsCheckResult.replyMessage);
            }
        }
        else {
            command.execute(message, commandInfo.args);
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

    return {name: commandName, args: args};
}

async function canCommandBeExecuted(message: Message, commandInfo: CommandInfoFromMessage): Promise<boolean> {
    //@ts-ignore
    var command = getCommandFromNameOrAlias(commandInfo.name);
    if(command === undefined) return false;

    if(command.adminOnly && !await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
        return false;
    }
    if(commandInfo.args.length < command.minArgs) {
        message.channel.send(Localizer.translate("messageEvent.missingArgs", {prefix: config.prefix, commandName: command.name}));
        return false;
    }
    return true;
}

function getCommandFromNameOrAlias(name: string): CreativeCommand | undefined {
    //@ts-ignore
    return commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));
}
