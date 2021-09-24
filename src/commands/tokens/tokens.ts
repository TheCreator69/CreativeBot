import {MessageAttachment, Message, User, TextBasedChannel} from "discord.js";
import * as Canvas from "canvas";
import * as TokenTableAccessor from "../../scripts/database/tokentableaccessor";
import {CreativeCommand} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import * as DiscordUtil from "../../scripts/discordutil";
import {LogChamp, Category} from "../../scripts/logchamp";

var logChampInst = new LogChamp(Category.TextProcessing);

export class TokensCommand implements CreativeCommand {
    name = Localizer.translate("tokens.name");
    description = Localizer.translate("tokens.description");
    syntax = Localizer.translate("tokens.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    async execute(message: Message, args: string[]): Promise<void> {
        this.displayInfoOfCorrectUser(message, args);
    }

    async displayInfoOfCorrectUser(message: Message, args: string[]): Promise<void> {
        if(!args.length) await this.displayUserInfoOnTokenBanner(message.channel, message.author);
        else {
            var mentionedUser = DiscordUtil.getUserFromMention(args[0]);
            if(mentionedUser === undefined) {
                message.channel.send(Localizer.translate("tokens.invalidUser"));
                return;
            }
            await this.displayUserInfoOnTokenBanner(message.channel, mentionedUser);
        }
    }

    //@ts-ignore
    async displayUserInfoOnTokenBanner(channel: TextBasedChannel, user: User): Promise<void> {
        var tokensBadge = await this.drawTokenBanner(user);
        const attachment = new MessageAttachment(tokensBadge, user.username + "_tokens.png");
        //@ts-ignore
        channel.send({embeds: [attachment]});
    }

    async drawTokenBanner(user: User): Promise<Buffer> {
        const canvas = Canvas.createCanvas(1000, 250);
        const context = canvas.getContext("2d");

        await this.drawBackground(canvas, context);
        await this.drawAuthorAvatar(context, user);
        await this.drawUserInfo(context, user);

        return canvas.toBuffer();
    }

    async drawBackground(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D): Promise<void> {
        const tokenBanner = await Canvas.loadImage("./media/CreativeTokensBanner.png");
        context.drawImage(tokenBanner, 0, 0, canvas.width, canvas.height);
    }

    async drawAuthorAvatar(context: Canvas.CanvasRenderingContext2D, user: User): Promise<void> {
        const avatar = await Canvas.loadImage(user.displayAvatarURL({format: "png"}));
        context.drawImage(avatar, 85, 50, 150, 150);
    }

    async drawUserInfo(context: Canvas.CanvasRenderingContext2D, user: User): Promise<void> {
        var userTokens = await TokenTableAccessor.getTokensOfUser(BigInt(user.id));
        var userVouchTokens = await TokenTableAccessor.getVouchTokensOfUser(BigInt(user.id));
        var tokenRank = await TokenTableAccessor.getTokenRankOfUser(BigInt(user.id));
        logChampInst.debug("User info retrived, ready to be drawn", {tokens: userTokens, vouchTokens: userVouchTokens, rank: tokenRank});

        context.font = "45px Bahnschrift";
        context.fillStyle = "#ffffff";
        context.fillText(user.username, 280, 100);

        context.font = "40px Arial"
        context.fillStyle = "#ffff00";
        context.fillText(userTokens.toString(), 330, 180);

        context.fillStyle = "#ff0000";
        context.fillText(userVouchTokens.toString(), 510, 180);

        context.fillStyle = "#0000ff";
        context.fillText(tokenRank.position + " of " + tokenRank.max, 685, 180);
    }
}
