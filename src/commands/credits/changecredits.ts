import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import {Message, User} from "discord.js";
import * as Localizer from "../../scripts/localizer";

export class ChangeCreditsCommand implements CreativeCommand {
    constructor(_userFromMentionCallback: (argument: string) => User | undefined) {
        this.userFromMentionCallback = _userFromMentionCallback;
    }

    name = Localizer.translate("changecredits.name");
    description = Localizer.translate("changecredits.description");
    syntax = Localizer.translate("changecredits.syntax");
    min_args = 3;
    admin_only = true;
    guild_only = false;

    userFromMentionCallback: (argument: string) => User | undefined;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        if(args[0] !== "add" && args[0] !== "remove" && args[0] !== "set") {
            return {valid: false, replyMessage: Localizer.translate("changecredits.invalidArg0")};
        }
        var amount = parseInt(args[1]);
        if(isNaN(amount)) {
            return {valid: false, replyMessage: Localizer.translate("changecredits.arg1NaN")};
        }
        const mentionedUser = this.userFromMentionCallback(args[2]);
        if(mentionedUser === undefined) {
            return {valid: false, replyMessage: Localizer.translate("changecredits.invalidArg2")};
        }
        if(amount > 2147483647 && args[0] === "set") {
            return {valid: false, replyMessage: Localizer.translate("changecredits.arg1TooLarge")};
        }
        if(await CreditsHandler.getCreditsForUser(BigInt(mentionedUser.id)) + amount > 2147483647 && args[0] !== "set") {
            return {valid: false, replyMessage: Localizer.translate("changecredits.arg1TooLarge")};
        }
        if(args[0] === "set" && amount < 0) {
            return {valid: false, replyMessage: Localizer.translate("changecredits.setNegative")};
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
        message.channel.send(Localizer.translate("changecredits.addedCredits", {amount: amount, username: mention.username}));
        await CreditsHandler.incrementCreditsForUser(BigInt(mention.id), amount);
    }

    async removeCreditsAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send(Localizer.translate("changecredits.removedCredits", {amount: amount, username: mention.username}));
        var amountToRemove = amount * -1 as number;
        await CreditsHandler.incrementCreditsForUser(BigInt(mention.id), amountToRemove);
    }

    async setCreditsAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send(Localizer.translate("changecredits.setCredits", {amount: amount, username: mention.username}));
        await CreditsHandler.setCreditsForUser(BigInt(mention.id), amount);
    }
}
