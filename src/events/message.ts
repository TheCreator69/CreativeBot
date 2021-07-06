import * as config from "../config.json";
import * as AdminCheck from "../scripts/admincheck";
import {commands} from "../index";
import {Message, Client} from "discord.js";
import {EventAttributes} from "../scripts/eventdef";
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
        var command = commands.get(commandInfo.name);
        if(command === undefined) return;

        if(command.guild_only) {
            if(!message.guild || !message.guild.available) {
                message.channel.send(Localizer.translate("messageEvent.guildOnlyCommand"));
                return;
            }
        }

        if(command.min_args) {
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
    var command = commands.get(commandInfo.name);
    if(command === undefined) return false;

    if(command.admin_only && !await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
        return false;
    }
    if(commandInfo.args.length < command.min_args) {
        message.channel.send(Localizer.translate("messageEvent.missingArgs", {prefix: config.prefix, commandName: command.name}));
        return false;
    }
    return true;
}
