import * as config from "../config.json";
import * as AdminCheck from "../scripts/admincheck";
import * as CreditsHandler from "../scripts/creditshandler";
import {commands} from "../index";
import {Message, Client} from "discord.js";

module.exports = {
    name: "message",
    async execute(message: Message, client: Client): Promise<void> {
        handleMessageInDifferentEnvironments(message);
    }
};

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
        executeCommand(message);
    }
    else if(!message.author.bot) {
        await handleCreativeCredits(message);
    }
}

async function handleMessageInDevAndBuild(message: Message): Promise<void> {
    if(message.content.startsWith(config.prefix) && !message.author.bot && await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
        executeCommand(message);
    }
}

async function handleMessageInMaintenance(message: Message) {
    if(message.content.startsWith(config.prefix) && !message.author.bot) {
        var commandInfo = getCommandInfoFromMessage(message);

        if(await canCommandBeExecuted(message, commandInfo)) {
            message.channel.send("Bot is currently under maintenance, you can't use any commands right now! Sorry! :frowning:");
        }
    }
}

async function handleCreativeCredits(message: Message): Promise<void> {
    if(message.type === "DEFAULT") {
        await CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), message.content.length);
    }
}

interface CommandInfo {
    name: string;
    args: string[];
}

async function executeCommand(message: Message): Promise<void> {
    var commandInfo = getCommandInfoFromMessage(message);

    if(await canCommandBeExecuted(message, commandInfo)) {
        var command = commands.get(commandInfo.name);
        command.execute(message, commandInfo.args);
    }
}

function getCommandInfoFromMessage(message: Message): CommandInfo {
    const args = message.content.slice(config.prefix.length).split(/ +/);

    var commandName = args.shift();
    if(commandName === undefined) {
        return {name: "", args: args};
    }
    commandName = commandName.toLowerCase();

    return {name: commandName, args: args};
}

async function canCommandBeExecuted(message: Message, commandInfo: CommandInfo): Promise<boolean> {
    if(!commands.has(commandInfo.name)) {
        return false;
    }
    var command = commands.get(commandInfo.name);
    if(command.admin_only && !await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
        return false;
    }
    if(commandInfo.args.length < command.min_args) {
        message.channel.send("You need to provide the required arguments for the command to work! See `" + config.prefix + "help " + command.name + "` for details!");
        return false;
    }
    return true;
}
