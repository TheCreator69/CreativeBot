import {MessageAttachment, Message} from "discord.js";
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
        await displayUserInfoOnCreditsBadge(message);
    }
};

async function displayUserInfoOnCreditsBadge(message: Message) {
    var userCredits = await CreditsHandler.getCreditsForUser(BigInt(message.author.id));
    var creditsRank = await CreditsHandler.getCreditsRankForUser(BigInt(message.author.id));
    var creditsBadge = await drawCreditsBadge(message, userCredits, creditsRank);

    const attachment = new MessageAttachment(creditsBadge, message.author.username + "_credits.png");
    message.channel.send(attachment);
}

async function drawCreditsBadge(message: Message, credits: number, creditsRank: {position: number, max: number}) {
    const canvas = Canvas.createCanvas(750, 200);
    const context = canvas.getContext("2d");

    drawBackground(canvas, context);
    await drawAuthorAvatar(canvas, context, message);
    drawUserInfo(canvas, context, message, credits, creditsRank);

    return canvas.toBuffer();
}

function drawBackground(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D): void {
    context.fillStyle = "#666666";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

async function drawAuthorAvatar(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, message: Message): Promise<void> {
    const avatar = await Canvas.loadImage(message.author.displayAvatarURL({format: "png"}));
    context.drawImage(avatar, 25, 25, 150, 150);
    context.strokeStyle = "#ffffff";
    context.lineWidth = 10;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = 5;
    context.strokeRect(25, 25, 150, 150);
}

function drawUserInfo(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, message: Message, credits: number, creditsRank: {position: number, max: number}) {
    context.font = UIFunctions.getFittingFontSize(canvas, context, message.author.username, 65);
    context.fillStyle = "#ffffff";
    context.fillText(message.author.username, 225, 75);
    context.font = UIFunctions.getFittingFontSize(canvas, context, credits.toString(), 45);
    context.fillStyle = "#ffff00";
    context.fillText("Creative Credits: " + credits, 225, 125);
    var rankText = "Credits Rank: #" + creditsRank.position + " out of " + creditsRank.max;
    context.font = UIFunctions.getFittingFontSize(canvas, context, rankText, 45);
    context.fillStyle = "#ff0000";
    context.fillText(rankText, 225, 175);
}
