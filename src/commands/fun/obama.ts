import {MessageAttachment, Message} from "discord.js";
import * as Canvas from "canvas";
import * as CanvasHelper from "../../scripts/canvashelper";

module.exports = {
    name: "obama",
    description: "Sends an inspiring Obama picture with an equally inspiring message (hopefully).",
    syntax: "obama <message>",
    min_args: 1,
    admin_only: false,
    async execute(message: Message, args: string[]) {
        sendObamaImageWithText(message, args);
    }
};

async function sendObamaImageWithText(message: Message, args: string[]): Promise<void> {
    var obamaImageBuffer = await createObamaImageBuffer(args);
    var attachment = new MessageAttachment(obamaImageBuffer, "obama-is-very-inspiring.png");
    message.channel.send(attachment);
}

async function createObamaImageBuffer(args: string[]): Promise<Buffer> {
    const canvas = Canvas.createCanvas(1200, 800);
    const context = canvas.getContext("2d");

    await drawImage(canvas, context);
    drawText(canvas, context, args);

    return canvas.toBuffer();
}

async function drawImage(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D): Promise<void> {
    var obamaImage = await Canvas.loadImage("../media/obama.png");
    context.drawImage(obamaImage, 0, 0, canvas.width, canvas.height);
}

function drawText(canvas: Canvas.Canvas, context: Canvas.CanvasRenderingContext2D, args: string[]): void {
    var imageText = constructTextFromArgs(args);

    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.font = CanvasHelper.getFittingFontSize(canvas, context, imageText, 70);
    context.fillText(imageText, canvas.width / 2, 150);
}

function constructTextFromArgs(args: string[]): string {
    var imageText = "";
    for(var arg of args) {
        imageText = imageText + arg + " ";
    }
    return imageText;
}
