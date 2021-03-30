const {MessageAttachment} = require("discord.js");

module.exports = {
    name: "obama",
    description: "Sends an inspiring Obama picture with custom text.",
    syntax: "obama <text>",
    execute(message, args) {
        const attachment = new MessageAttachment("https://www.acclaimimages.com/_gallery/_free_images/0519-0906-1522-3927_president_barack_obama_points_at_you_o.jpg");
        message.channel.send(attachment);
    }
};
