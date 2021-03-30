const {MessageAttachment} = require("discord.js");
const Canvas = require("canvas");
//TODO: Center the string, adaptive text size

module.exports = {
    name: "obama",
    description: "Sends an inspiring Obama picture with an equally inspiring message (hopefully).",
    syntax: "obama <message>",
    async execute(message, args) {
        const canvas = Canvas.createCanvas(1200, 800);
        const ctx = canvas.getContext("2d");

        var obamaImage = await Canvas.loadImage("./obama.png");
        ctx.drawImage(obamaImage, 0, 0, canvas.width, canvas.height);

        ctx.font = "50px Arial";
        ctx.fillStyle = "#000000";
        if(!args.length) {
            ctx.fillText("I see you didn't enter a message, shame on YOU!", 50, 100);
        }
        else {
            var imageText = "";
            for(var arg of args) {
                imageText = imageText + arg + " ";
            }
            ctx.fillText(imageText, 50, 100);
        }

        var attachment = new MessageAttachment(canvas.toBuffer(), "obama-is-very-inspiring.png");
        message.channel.send(attachment);
    }
};
