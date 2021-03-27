const Discord = require("discord.js");

module.exports = {
    name: "embed",
    description: "Tests the embed.",
    execute(message, args) {
        const testEmbed = new Discord.MessageEmbed()
        testEmbed.setColor("#ff0000")
        testEmbed.setTitle("A great title");
        testEmbed.setDescription("Some description, I guess.");
        testEmbed.setAuthor("TheCreator", "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.nag.co.za%2Fwp-content%2Fuploads%2F2014%2F09%2Frekt-mate.jpg&f=1&nofb=1", "https://www.nag.co.za/2014/09/17/destiny-and-the-dangers-of-playing-it-safe/");
        message.channel.send(testEmbed);
    }
};
