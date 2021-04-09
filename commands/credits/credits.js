const {MessageAttachment} = require("discord.js");
const Canvas = require("canvas");

module.exports = {
    name: "credits",
    description: "Check your own credit balance.",
    syntax: "credits",
    min_args: 0,
    admin_only: false,
    async execute(message, args) {
        const canvas = Canvas.createCanvas(750, 200);
        const context = canvas.getContext("2d");

        context.fillStyle = "#666666";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({format: "png"}));
        context.drawImage(avatar, 25, 25, 150, 150);
        context.strokeStyle = "#ffffff";
        context.lineWidth = 10;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 5;
        context.strokeRect(25, 25, 150, 150);

        context.font = "60px Arial";
        context.fillStyle = "#ffffff";
        context.fillText(message.author.username, 225, 75);
        context.font = "40px Arial";
        context.fillStyle = "#ffff00";
        context.fillText("Creative Credits: 0", 225, 125);
        context.fillStyle = "#ff0000";
        context.fillText("Credits Rank: #1 out of 1", 225, 175);

        const attachment = new MessageAttachment(canvas.toBuffer(), message.author.username + "_credits.png");
        message.channel.send(attachment);
    }
};
