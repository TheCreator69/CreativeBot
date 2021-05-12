import {MessageAttachment, Message, User, TextChannel, DMChannel, NewsChannel} from "discord.js";
import * as Canvas from "canvas";
import * as CreditsHandler from "../../scripts/creditshandler";
import * as UIFunctions from "../../scripts/uifunctions";

module.exports = {
    name: "credits",
    description: "Checks your Creative Credits balance.",
    syntax: "credits",
    min_args: 0,
    admin_only: false,
    async execute(message: Message, args: string[]) {
        await displayUserInfoOnCreditsBadge(message.channel, message.author);
    }
};

async function displayUserInfoOnCreditsBadge(channel: TextChannel | DMChannel | NewsChannel, user: User) {
    var userCredits = await CreditsHandler.getCreditsForUser(BigInt(user.id));
    var creditsRank = await CreditsHandler.getCreditsRankForUser(BigInt(user.id));
    var creditsBadge = await drawCreditsBadge(user, userCredits, creditsRank);

    const attachment = new MessageAttachment(creditsBadge, user.username + "_credits.png");
    channel.send(attachment);
}

async function drawCreditsBadge(user: User, credits: number, creditsRank: {position: number, max: number}) {
    const canvas = Canvas.createCanvas(750, 200);
    const context = canvas.getContext("2d");

    drawBackground(canvas, context);
    await drawAuthorAvatar(canvas, context, user);
    drawUserInfo(canvas, context, user, credits, creditsRank);

    return canvas.toBuffer();
}

function drawBackground(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D): void {
    context.fillStyle = "#666666";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

async function drawAuthorAvatar(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, user: User): Promise<void> {
    const avatar = await Canvas.loadImage(user.displayAvatarURL({format: "png"}));
    context.drawImage(avatar, 25, 25, 150, 150);
    context.strokeStyle = "#ffffff";
    context.lineWidth = 10;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 5;
    context.strokeRect(25, 25, 150, 150);
}

function drawUserInfo(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, user: User, credits: number, creditsRank: {position: number, max: number}) {
    context.font = UIFunctions.getFittingFontSize(canvas, context, user.username, 65);
    context.fillStyle = "#ffffff";
    context.fillText(user.username, 210, 75);
    context.font = UIFunctions.getFittingFontSize(canvas, context, credits.toString(), 45);
    context.fillStyle = "#ffff00";
    context.fillText("Creative Credits: " + credits, 210, 125);
    var rankText = "Credits Rank: #" + creditsRank.position + " out of " + creditsRank.max;
    context.font = UIFunctions.getFittingFontSize(canvas, context, rankText, 45);
    context.fillStyle = "#ff0000";
    context.fillText(rankText, 210, 175);
}
