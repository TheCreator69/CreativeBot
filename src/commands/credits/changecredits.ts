import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommandAttributes} from "../../scripts/commanddef";
import {Message} from "discord.js";

export var info: CreativeCommandAttributes = {
    name: "changecredits",
    description: "Changes or sets Creative Credits for a specific user.",
    syntax: "changecredits <add/remove/set> <amount> <user mention>",
    min_args: 3,
    admin_only: true,
}

export async function execute(message: Message, args: string[]): Promise<void> {
    const mention = message.mentions.users.values().next().value;
    if(!checkForValidArgsAndNotifyUser(message, args, mention)) {
        return;
    }
    var amount = parseInt(args[1]);
    if(args[0] === "add") {
        await addCreditsAndNotifyUser(message, amount, mention);
        return;
    }
    else if(args[0] === "remove") {
        await removeCreditsAndNotifyUser(message, amount, mention);
        return;
    }
    else {
        await setCreditsAndNotifyUser(message, amount, mention);
        return;
    }
}

function checkForValidArgsAndNotifyUser(message: any, args: string[], mention: any): boolean {
    if(args[0] !== "add" && args[0] !== "remove" && args[0] !== "set") {
        message.channel.send("Please use either \"add\", \"remove\" or \"set\" to change a user's Creative Credits!");
        return false;
    }
    var amount = parseInt(args[1]);
    if(isNaN(amount)) {
        message.channel.send("Please enter a valid amount of Creative Credits!");
        return false;
    }
    if(mention === undefined) {
        message.channel.send("Please mention a user!");
        return false;
    }
    if(args[0] === "set" && amount < 0) {
        message.channel.send("You can't set someone's Creative Credits to be negative! They'll be in debt and that's just cruel :pleading_face:");
        return false;
    }
    return true;
}

async function addCreditsAndNotifyUser(message: any, amount: number, mention: any): Promise<void> {
    message.channel.send("Added " + amount + " Creative Credits to " + mention.username + "!");
    await CreditsHandler.incrementCreditsForUser(mention.id, amount);
}

async function removeCreditsAndNotifyUser(message: any, amount: number, mention: any): Promise<void> {
    message.channel.send("Removed " + amount + " Creative Credits from" + mention.username + "!");
    var amountToRemove = amount * -1 as number;
    await CreditsHandler.incrementCreditsForUser(mention.id, amountToRemove);
}

async function setCreditsAndNotifyUser(message: any, amount: number, mention: any): Promise<void> {
    message.channel.send("Set Creative Credits to " + amount + " for " + mention.username + "!");
    await CreditsHandler.setCreditsForUser(mention.id, amount);
}
