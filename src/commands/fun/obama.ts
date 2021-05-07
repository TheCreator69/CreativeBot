import {MessageAttachment} from "discord.js";
import * as Canvas from "canvas";

module.exports = {
    name: "obama",
    description: "Sends an inspiring Obama picture with an equally inspiring message (hopefully).",
    syntax: "obama <message>",
    min_args: 1,
    admin_only: false,
    async execute(message: any, args: string[]) {
        var obamaImageBuffer = await createObamaImageBuffer(args);
        var attachment = new MessageAttachment(obamaImageBuffer, "obama-is-very-inspiring.png");
        message.channel.send(attachment);
    }
};

async function createObamaImageBuffer(args: string[]) {
    const canvas = Canvas.createCanvas(1200, 800);
    const context = canvas.getContext("2d");

    await drawImage(canvas, context);
    drawText(canvas, context, args);

    return canvas.toBuffer();
}

async function drawImage(canvas: any, context: any) {
    var obamaImage = await Canvas.loadImage("../media/obama.png");
    context.drawImage(obamaImage, 0, 0, canvas.width, canvas.height);
}

function drawText(canvas: any, context: any, args: string[]) {
    var imageText = constructTextFromArgs(args);

    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.font = getFittingFontSize(canvas, context, imageText);
    context.fillText(imageText, canvas.width / 2, 150);
}

function constructTextFromArgs(args: string[]) {
    var imageText = "";
    for(var arg of args) {
        imageText = imageText + arg + " ";
    }
    return imageText;
}

function getFittingFontSize(canvas: any, context: any, text: string) {
    let fontSize = 70;

    do {
        context.font = `${fontSize -= 5}px Arial`;
    } while(context.measureText(text).width > canvas.width - 100);

    return context.font;
}
