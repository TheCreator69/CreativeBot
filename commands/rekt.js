const { MessageAttachment } = require("discord.js");

module.exports = {
    name: "rekt",
    description: "Sends a wonderful image.",
    syntax: "rekt",
    execute(message, args) {
        const attachment = new MessageAttachment("http://www.nag.co.za/wp-content/uploads/2014/09/rekt-mate.jpg");
        message.channel.send(attachment);
    }
};
