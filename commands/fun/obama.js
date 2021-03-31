const {MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
const noMessageEntered = "I see you didn't enter a message, shame on YOU!";
//TODO: Center the string

module.exports = {
    name: "obama",
    description: "Sends an inspiring Obama picture with an equally inspiring message (hopefully).",
    syntax: "obama <message>",
    async execute(message, args) {
        const canvas = Canvas.createCanvas(1200, 800);
        const ctx = canvas.getContext("2d");

        var obamaImage = await Canvas.loadImage("./obama.png");
        ctx.drawImage(obamaImage, 0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        if(!args.length) {
            ctx.font = getFittingFontSize(canvas, noMessageEntered);
            ctx.fillText(noMessageEntered, canvas.width / 2, 150);
        }
        else {
            var imageText = "";
            for(var arg of args) {
                imageText = imageText + arg + " ";
            }
            ctx.font = getFittingFontSize(canvas, imageText);
            ctx.fillText(imageText, canvas.width / 2, 150);
        }

        var attachment = new MessageAttachment(canvas.toBuffer(), "obama-is-very-inspiring.png");
        message.channel.send(attachment);
    }
};

function getFittingFontSize(canvas, text) {
    const ctx = canvas.getContext("2d");
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 5}px Arial`;
    } while(ctx.measureText(text).width > canvas.width - 100);

    return ctx.font;
}
