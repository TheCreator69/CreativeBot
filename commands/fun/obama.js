const {MessageAttachment} = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    name: "obama",
    description: "Sends an inspiring Obama picture with an equally inspiring message (hopefully).",
    syntax: "obama <message>",
    admin_only: false,
    async execute(message, args) {
        var obamaImageBuffer = await createObamaImageBuffer(args);
        var attachment = new MessageAttachment(obamaImageBuffer, "obama-is-very-inspiring.png");
        message.channel.send(attachment);
    }
};

async function createObamaImageBuffer(args) {
    const canvas = Canvas.createCanvas(1200, 800);
    const context = canvas.getContext("2d");

    await drawImage(canvas, context);
    drawText(canvas, context, args);

    return canvas.toBuffer();
}

async function drawImage(canvas, context) {
    var obamaImage = await Canvas.loadImage("./media/obama.png");
    context.drawImage(obamaImage, 0, 0, canvas.width, canvas.height);
}

function drawText(canvas, context, args) {
    var imageText = constructTextFromArgs(args);

    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.font = getFittingFontSize(canvas, context, imageText);
    context.fillText(imageText, canvas.width / 2, 150);
}

function constructTextFromArgs(args) {
    var imageText = "";
    const noMessageEntered = "I see you didn't enter a message, shame on YOU!";

    if(!args.length) {
        imageText = noMessageEntered;
    }
    else {
        for(var arg of args) {
            imageText = imageText + arg + " ";
        }
    }

    return imageText;
}

function getFittingFontSize(canvas, context, text) {
    let fontSize = 70;

    do {
        context.font = `${fontSize -= 5}px Arial`;
    } while(context.measureText(text).width > canvas.width - 100);

    return context.font;
}
