import {Message, User} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import * as DiscordUtil from "../../scripts/discordutil";
import * as TokenTableAccessor from "../../scripts/database/tokentableaccessor";
import * as RoleManager from "../../scripts/tokensystem/rolemanager";
import {client} from "../../index";
import * as UIFunctions from "../../scripts/uifunctions";

export class VouchCommand implements CreativeCommand {
    name = Localizer.translate("vouch.name");
    description = Localizer.translate("vouch.description");
    syntax = Localizer.translate("vouch.syntax");
    minArgs = 2;
    adminOnly = false;
    guildOnly = true;

    async checkRequiredArgs(args: string[], message?: Message): Promise<ArgsCheckResult> {
        //@ts-ignore
        var specifiedUser = await this.getUserFromVaryingInput(message, args);

        if(specifiedUser === undefined) {
            return {valid: false, replyMessage: Localizer.translate("vouch.invalidUser")};
        }
        if(specifiedUser.id === message?.author.id) {
            return {valid: false, replyMessage: Localizer.translate("vouch.selfVouching")};
        }
        if(specifiedUser.bot) {
            return {valid: false, replyMessage: Localizer.translate("vouch.vouchingForBot")};
        }

        var amountToGrant = parseInt(args[args.length - 1]);
        if(isNaN(amountToGrant)) {
            return {valid: false, replyMessage: Localizer.translate("vouch.arg1NaN")};
        }
        if(amountToGrant <= 0) {
            return {valid: false, replyMessage: Localizer.translate("vouch.amountZeroOrLess")};
        }

        if(message === undefined) return {valid: false, replyMessage: ""};
        var authorVouchTokens = await TokenTableAccessor.getVouchTokensOfUser(BigInt(message.author.id));
        if(authorVouchTokens === 0) {
            return {valid: false, replyMessage: Localizer.translate("vouch.noMoreTokens")};
        }
        if(amountToGrant > authorVouchTokens) {
            return {valid: false, replyMessage: Localizer.translate("vouch.notEnoughTokens")};
        }

        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        var specifiedUser = await this.getUserFromVaryingInput(message, args);
        const vouchAmount = parseInt(args[args.length - 1]);

        if(specifiedUser === undefined) return;
        await TokenTableAccessor.incrementTokensOfUser(BigInt(specifiedUser.id), vouchAmount);
        await TokenTableAccessor.incrementVouchTokensOfUser(BigInt(message.author.id), -vouchAmount);

        var specifiedUserRank = await TokenTableAccessor.getTokenRankOfUser(BigInt(specifiedUser.id));
        if(specifiedUserRank.position <= 10) {
            RoleManager.addRoleToTopEarner(BigInt(specifiedUser.id));
        }

        if(vouchAmount > 1) {
            message.channel.send(Localizer.translate("vouch.vouchAnnouncement", {voucher: message.author.username, target: specifiedUser?.username, amount: vouchAmount}));
        }
        else {
            message.channel.send(Localizer.translate("vouch.vouchAnnouncementSingular", {voucher: message.author.username, target: specifiedUser?.username}));
        }
    }

    async getUserFromVaryingInput(message: Message, args: string[]): Promise<User | undefined> {
        if(message?.mentions.users.size !== 0) {
            return DiscordUtil.getUserFromMention(args[0]);
        }
        else if(!isNaN(Number.parseInt(args[0]))) {
            return await client.users.fetch(args[0]);
        }
        else {
            return await this.getUserFromNameAndDiscriminator(message, args);
        }
    }

    async getUserFromNameAndDiscriminator(message: Message, args: string[]): Promise<User | undefined> {
        var searchString = UIFunctions.createStringFromArrayWithSeparatorAndEndOffset(args, 0, 1, " ");
        const userIdentifiers = searchString.split("#");

        //@ts-ignore
        const guildOfMessage = await client.guilds.fetch(message.guild?.id);
        const foundMembers = guildOfMessage.members.cache.filter( (member): boolean => {
            if(member.user.username.toLowerCase() === userIdentifiers[0].toLowerCase() && member.user.discriminator === userIdentifiers[1]) return true;
            else return false;
        });

        const member = foundMembers.first();
        return member?.user;
    }
}
