import * as config from "../config.json";
import * as AdminCheck from "../scripts/admincheck";
import {commands, client} from "../index";
import {Message, Client} from "discord.js";
import {EventAttributes} from "../scripts/eventdef";
import * as Localizer from "../scripts/localizer";

export var info: EventAttributes = {
    name: "message",
}

export async function execute(client: Client, message: Message): Promise<void> {
    await handleMessageInDifferentEnvironments(message);
}

async function handleMessageInDifferentEnvironments(message: Message): Promise<void> {
    if(process.env.NODE_ENV == "production") {
        handleMessageInProduction(message);
    }
    else if(process.env.NODE_ENV == "development" || process.env.NODE_ENV == "build") {
        handleMessageInDevAndBuild(message);
    }
    else if(process.env.NODE_ENV == "maintenance") {
        handleMessageInMaintenance(message);
    }
}

async function handleMessageInProduction(message: Message): Promise<void> {
    if(message.content.startsWith(config.prefix) && !message.author.bot) {
        await executeCommandIfPossible(message);
    }
}

async function handleMessageInDevAndBuild(message: Message): Promise<void> {
    if(message.content.startsWith(config.prefix) && !message.author.bot) {
        if(await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
            if(message.channel.type == "dm") {
                await executeCommandIfPossible(message);
            }
            else if(message.guild && message.guild.available && message.guild.id == config.testServerID) {
                await executeCommandIfPossible(message);
            }
        }
    }
}

async function handleMessageInMaintenance(message: Message): Promise<void> {
    if(message.content.startsWith(config.prefix) && !message.author.bot) {
        var commandInfo = getCommandInfoFromMessage(message);

        if(await canCommandBeExecuted(message, commandInfo)) {
            message.channel.send(Localizer.translate("messageEvent.maintenanceReply"));
        }
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
