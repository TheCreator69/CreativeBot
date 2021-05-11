import * as config from "../config.json";
import * as AdminCheck from "../scripts/admincheck";
import * as CreditsHandler from "../scripts/creditshandler";
import {commandMap} from "../index";
import {Message, Client} from "discord.js";

module.exports = {
    name: "message",
    async execute(message: Message, client: Client) {
        if(process.env.NODE_ENV == "production") {
            if(message.content.startsWith(config.prefix) && !message.author.bot) {
                executeCommand(message);
            }
            else if(!message.author.bot) {
                await handleCreativeCredits(message);
            }
        }
        else if(process.env.NODE_ENV == "development" || process.env.NODE_ENV == "build") {
            if(message.content.startsWith(config.prefix) && !message.author.bot && await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
                executeCommand(message);
            }
        }
    }
};

async function handleCreativeCredits(message: Message) {
    if(message.type === "DEFAULT") {
        await CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), message.content.length);
    }
}

async function executeCommand(message: Message) {
    const args = message.content.slice(config.prefix.length).split(/ +/);

    var command = args.shift();
    if(command === undefined) return;
    command = command.toLowerCase();

    if(!commandMap.has(command)) {
        return;
    }
    var commandMapEntry = commandMap.get(command);
    if(commandMapEntry.admin_only && !await AdminCheck.checkIfUserIsAdmin(BigInt(message.author.id))) {
        return;
    }
    if(args.length < commandMapEntry.min_args) {
        message.channel.send("You need to provide the required arguments for the command to work! See `" + config.prefix + "help " + commandMapEntry.name + "` for details!");
        return;
    }
    commandMapEntry.execute(message, args);
}
