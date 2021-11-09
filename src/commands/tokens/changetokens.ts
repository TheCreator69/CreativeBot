import * as TokenTableAccessor from "../../scripts/database/tokentableaccessor";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import {Message, User, CommandInteraction} from "discord.js";
import * as Localizer from "../../scripts/localizer";
import {SlashCommandBuilder} from "@discordjs/builders";

export class ChangeTokensCommand implements CreativeCommand {
    constructor(_userFromMentionCallback: (argument: string) => User | undefined) {
        this.userFromMentionCallback = _userFromMentionCallback;
    }

    commandBuilder = new SlashCommandBuilder()
    .setName("changetokens")
    .setDescription("Changes tokens of a given user");
    data = this.commandBuilder;
    name = Localizer.translate("changetokens.name");
    description = Localizer.translate("changetokens.description");
    syntax = Localizer.translate("changetokens.syntax");
    minArgs = 3;
    adminOnly = true;
    guildOnly = false;

    userFromMentionCallback: (argument: string) => User | undefined;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        if(args[0] !== "add" && args[0] !== "remove" && args[0] !== "set") {
            return {valid: false, replyMessage: Localizer.translate("changetokens.invalidArg0")};
        }
        var amount = parseInt(args[1]);
        if(isNaN(amount)) {
            return {valid: false, replyMessage: Localizer.translate("changetokens.arg1NaN")};
        }
        const mentionedUser = this.userFromMentionCallback(args[2]);
        if(mentionedUser === undefined) {
            return {valid: false, replyMessage: Localizer.translate("changetokens.invalidArg2")};
        }
        if(amount > 2147483647 && args[0] === "set") {
            return {valid: false, replyMessage: Localizer.translate("changetokens.arg1TooLarge")};
        }
        if(await TokenTableAccessor.getTokensOfUser(BigInt(mentionedUser.id)) + amount > 2147483647 && args[0] !== "set") {
            return {valid: false, replyMessage: Localizer.translate("changetokens.arg1TooLarge")};
        }
        if(args[0] === "set" && amount < 0) {
            return {valid: false, replyMessage: Localizer.translate("changetokens.setNegative")};
        }
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        const mention: User = message.mentions.users.values().next().value;
        var amount = parseInt(args[1]);
        if(args[0] === "add") {
            await this.addTokensAndNotifyUser(message, amount, mention);
            return;
        }
        else if(args[0] === "remove") {
            await this.removeTokensAndNotifyUser(message, amount, mention);
            return;
        }
        else {
            await this.setTokensAndNotifyUser(message, amount, mention);
            return;
        }
    }

    async executeInteraction(interaction: CommandInteraction): Promise<void> {

    }

    async addTokensAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send(Localizer.translate("changetokens.addedTokens", {amount: amount, username: mention.username}));
        await TokenTableAccessor.incrementTokensOfUser(BigInt(mention.id), amount);
    }

    async removeTokensAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send(Localizer.translate("changetokens.removedTokens", {amount: amount, username: mention.username}));
        var amountToRemove = amount * -1 as number;
        await TokenTableAccessor.incrementTokensOfUser(BigInt(mention.id), amountToRemove);
    }

    async setTokensAndNotifyUser(message: Message, amount: number, mention: User): Promise<void> {
        message.channel.send(Localizer.translate("changetokens.setTokens", {amount: amount, username: mention.username}));
        await TokenTableAccessor.setTokensOfUser(BigInt(mention.id), amount);
    }
}
