import {MessageAttachment, Message, User, TextChannel, DMChannel, NewsChannel} from "discord.js";
import * as Canvas from "canvas";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";
import * as DiscordUtil from "../../scripts/discordutil";

export class TokensCommand implements CreativeCommand {
    name = Localizer.translate("tokens.name");
    description = Localizer.translate("tokens.description");
    syntax = Localizer.translate("tokens.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    async execute(message: Message, args: string[]): Promise<void> {
        this.displayInfoOfCorrectUser(message, args);
    }

    async displayInfoOfCorrectUser(message: Message, args: string[]): Promise<void> {
        if(!args.length) await this.displayUserInfoOnTokensBanner(message.channel, message.author);
        else {
            var mentionedUser = DiscordUtil.getUserFromMention(args[0]);
            if(mentionedUser === undefined) {
                message.channel.send(Localizer.translate("tokens.invalidUser"));
                return;
            }
            await this.displayUserInfoOnTokensBanner(message.channel, mentionedUser);
        }
    }

    async displayUserInfoOnTokensBanner(channel: TextChannel | DMChannel | NewsChannel, user: User): Promise<void> {
        var userTokens = await CreditsHandler.getCreditsForUser(BigInt(user.id));
        var tokenRank = await CreditsHandler.getCreditsRankForUser(BigInt(user.id));
        var tokensBadge = await this.drawTokensBadge(user, userTokens, tokenRank);

        const attachment = new MessageAttachment(tokensBadge, user.username + "tokens.png");
        channel.send(attachment);
    }

    async drawTokensBadge(user: User, tokens: number, tokenRank: CreditsHandler.CreditsRanking): Promise<Buffer> {
        const canvas = Canvas.createCanvas(1000, 250);
        const context = canvas.getContext("2d");

        await this.drawBackground(canvas, context);
        await this.drawAuthorAvatar(context, user);
        this.drawUserInfo(context, user, tokens, tokenRank);

        return canvas.toBuffer();
    }

    async drawBackground(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D): Promise<void> {
        const tokenBanner = await Canvas.loadImage("./media/CreativeCreditsBanner.png");
        context.drawImage(tokenBanner, 0, 0, canvas.width, canvas.height);
    }

    async drawAuthorAvatar(context: Canvas.CanvasRenderingContext2D, user: User): Promise<void> {
        const avatar = await Canvas.loadImage(user.displayAvatarURL({format: "png"}));
        context.drawImage(avatar, 85, 50, 150, 150);
    }

    drawUserInfo(context: Canvas.CanvasRenderingContext2D, user: User, tokens: number, tokenRank: CreditsHandler.CreditsRanking): void {
        context.font = "45px Bahnschrift";
        context.fillStyle = "#ffffff";
        context.fillText(user.username, 280, 100);
        context.font = "40px Arial"
        context.fillStyle = "#ffff00";
        context.fillText(tokens.toString(), 340, 180);
        context.font = "40px Arial"
        context.fillStyle = "#ff0000";
        context.fillText(tokenRank.position + " of " + tokenRank.max, 640, 180);
    }
}
