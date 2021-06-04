import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import {Message, User} from "discord.js";

export class ChangeCreditsCommand implements CreativeCommand {
    constructor(_userFromMentionCallback: (argument: string) => User | undefined) {
        this.userFromMentionCallback = _userFromMentionCallback;
    }

    name = "changecredits";
    description = "Changes or sets Creative Credits for a specific user";
    syntax = "changecredits <add/remove/set> <amount> <user mention>";
    min_args = 3;
    admin_only = true;
    guild_only = false;

    userFromMentionCallback: (argument: string) => User | undefined;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        if(args[0] !== "add" && args[0] !== "remove" && args[0] !== "set") {
            return {valid: false, replyMessage: "Please use either \"add\", \"remove\" or \"set\" to change a user's Creative Credits!"};
        }
        var amount = parseInt(args[1]);
        if(isNaN(amount)) {
            return {valid: false, replyMessage: "Please enter a valid amount of Creative Credits!"};
        }
        if(amount > 2147483647) {
            return {valid: false, replyMessage: "Can't set Creative Credits to more than 2147483647!"};
        }
        const mentionedUser = this.userFromMentionCallback(args[2]);
        if(mentionedUser === undefined) {
            return {valid: false, replyMessage: "Please mention a user!"};
        }
        if(args[0] === "set" && amount < 0) {
            return {valid: false, replyMessage: "You can't set someone's Creative Credits to be negative! They'll be in debt and that's just cruel :pleading_face:"};
        }
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        const mention: User = message.mentions.users.values().next().value;
        var amount = parseInt(args[1]);
        if(args[0] === "add") {
            await this.addCreditsAndNotifyUser(message, amount, mention);
            return;
        }
        else if(args[0] === "remove") {
            await this.removeCreditsAndNotifyUser(message, amount, mention);
            return;
        }
        else {
            await this.setCreditsAndNotifyUser(message, amount, mention);
            return;
        }
    }

    async addCreditsAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send("Added " + amount + " Creative Credits to " + mention.username + "!");
        await CreditsHandler.incrementCreditsForUser(BigInt(mention.id), amount);
    }

    async removeCreditsAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send("Removed " + amount + " Creative Credits from" + mention.username + "!");
        var amountToRemove = amount * -1 as number;
        await CreditsHandler.incrementCreditsForUser(BigInt(mention.id), amountToRemove);
    }

    async setCreditsAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send("Set Creative Credits to " + amount + " for " + mention.username + "!");
        await CreditsHandler.setCreditsForUser(BigInt(mention.id), amount);
    }
}
