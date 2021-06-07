import {MessageAttachment, Message, User, TextChannel, DMChannel, NewsChannel} from "discord.js";
import * as Canvas from "canvas";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";
import * as DiscordUtil from "../../scripts/discordutil";

export class CreditsCommand implements CreativeCommand {
    name = Localizer.translate("credits.name");
    description = Localizer.translate("credits.description");
    syntax = Localizer.translate("credits.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    async execute(message: Message, args: string[]): Promise<void> {
        this.displayInfoOfCorrectUser(message, args);
    }

    async displayInfoOfCorrectUser(message: Message, args: string[]): Promise<void> {
        if(!args.length) await this.displayUserInfoOnCreditsBanner(message.channel, message.author);
        else {
            var mentionedUser = DiscordUtil.getUserFromMention(args[0]);
            if(mentionedUser === undefined) {
                message.channel.send(Localizer.translate("credits.invalidUser"));
                return;
            }
            await this.displayUserInfoOnCreditsBanner(message.channel, mentionedUser);
        }
    }

    async displayUserInfoOnCreditsBanner(channel: TextChannel | DMChannel | NewsChannel, user: User): Promise<void> {
        var userCredits = await CreditsHandler.getCreditsForUser(BigInt(user.id));
        var creditsRank = await CreditsHandler.getCreditsRankForUser(BigInt(user.id));
        var creditsBadge = await this.drawCreditsBadge(user, userCredits, creditsRank);

        const attachment = new MessageAttachment(creditsBadge, user.username + "_credits.png");
        channel.send(attachment);
    }

    async drawCreditsBadge(user: User, credits: number, creditsRank: CreditsHandler.CreditsRanking): Promise<Buffer> {
        const canvas = Canvas.createCanvas(1000, 250);
        const context = canvas.getContext("2d");

        await this.drawBackground(canvas, context);
        await this.drawAuthorAvatar(context, user);
        this.drawUserInfo(context, user, credits, creditsRank);

        return canvas.toBuffer();
    }

    async drawBackground(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D): Promise<void> {
        const creditsBanner = await Canvas.loadImage("./media/CreativeCreditsBanner.png");
        context.drawImage(creditsBanner, 0, 0, canvas.width, canvas.height);
    }

    async drawAuthorAvatar(context: Canvas.CanvasRenderingContext2D, user: User): Promise<void> {
        const avatar = await Canvas.loadImage(user.displayAvatarURL({format: "png"}));
        context.drawImage(avatar, 85, 50, 150, 150);
    }

    drawUserInfo(context: Canvas.CanvasRenderingContext2D, user: User, credits: number, creditsRank: CreditsHandler.CreditsRanking): void {
        context.font = "45px Bahnschrift";
        context.fillStyle = "#ffffff";
        context.fillText(user.username, 280, 100);
        context.font = "40px Arial"
        context.fillStyle = "#ffff00";
        context.fillText(credits.toString(), 340, 180);
        context.font = "40px Arial"
        context.fillStyle = "#ff0000";
        context.fillText(creditsRank.position + " of " + creditsRank.max, 640, 180);
    }
}
