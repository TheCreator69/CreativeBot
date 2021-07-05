import {Message} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";
import * as DiscordUtil from "../../scripts/discordutil";
import * as TokenTableAccessor from "../../scripts/tokentableaccessor";
import * as RoleManager from "../../scripts/tokensystem/rolemanager";
import {client} from "../../index";

export class VouchCommand implements CreativeCommand {
    name = Localizer.translate("vouch.name");
    description = Localizer.translate("vouch.description");
    syntax = Localizer.translate("vouch.syntax");
    min_args = 2;
    admin_only = false;
    guild_only = true;

    async checkRequiredArgs(args: string[], message?: Message): Promise<ArgsCheckResult> {
        var mentionedUser = undefined;

        if(message?.mentions.users.size !== 0) {
            mentionedUser = DiscordUtil.getUserFromMention(args[0]);
        }
        else {
            mentionedUser = await client.users.fetch(args[0]);
        }
        console.log(mentionedUser);
        if(mentionedUser === undefined) {
            return {valid: false, replyMessage: Localizer.translate("vouch.invalidUser")};
        }
        if(mentionedUser.id === message?.author.id) {
            return {valid: false, replyMessage: Localizer.translate("vouch.selfVouching")};
        }
        if(mentionedUser.bot) {
            return {valid: false, replyMessage: Localizer.translate("vouch.vouchingForBot")};
        }

        var amountToGrant = parseInt(args[1]);
        if(isNaN(amountToGrant)) {
            return {valid: false, replyMessage: Localizer.translate("vouch.arg1NaN")};
        }
        if(amountToGrant <= 0) {
            return {valid: false, replyMessage: Localizer.translate("vouch.amountZeroOrLess")};
        }

        var authorVouchTokens = await TokenTableAccessor.getVouchTokensOfUser(BigInt(message?.author.id));
        if(authorVouchTokens === 0) {
            return {valid: false, replyMessage: Localizer.translate("vouch.noMoreTokens")};
        }
        if(amountToGrant > authorVouchTokens) {
            return {valid: false, replyMessage: Localizer.translate("vouch.notEnoughTokens")};
        }

        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        var mentionedUser = undefined;
        if(message?.mentions.users.size !== 0) {
            mentionedUser = DiscordUtil.getUserFromMention(args[0]);
        }
        else {
            mentionedUser = await client.users.fetch(args[0]);
        }

        const vouchAmount = parseInt(args[1]);

        await TokenTableAccessor.incrementTokensOfUser(BigInt(mentionedUser?.id), vouchAmount);
        await TokenTableAccessor.incrementVouchTokensOfUser(BigInt(message.author.id), -vouchAmount);

        var mentionedUserRank = await TokenTableAccessor.getTokenRankOfUser(BigInt(mentionedUser?.id));
        if(mentionedUserRank.position <= 10) {
            RoleManager.addRoleToTopEarner(BigInt(mentionedUser?.id));
        }

        if(vouchAmount > 1) {
            message.channel.send(Localizer.translate("vouch.vouchAnnouncement", {voucher: message.author.username, target: mentionedUser?.username, amount: vouchAmount}));
        }
        else {
            message.channel.send(Localizer.translate("vouch.vouchAnnouncementSingular", {voucher: message.author.username, target: mentionedUser?.username}));
        }
    }
}
