const Discord = require("discord.js");

module.exports = {
    name: "socials",
    description: "Tests the embed.",
    execute(message, args) {
        const testEmbed = new Discord.MessageEmbed()
        testEmbed.setColor("#ff0000")
        testEmbed.setTitle("Follow me on social media!");
        testEmbed.setDescription("I post little to nothing, but seeing my follower count increase is incredibly satisfying.");
        testEmbed.setAuthor("TheCreator", "https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA");
        testEmbed.setThumbnail("https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo");
        testEmbed.addField("YouTube", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA", true);
        testEmbed.addField("Twitter", "https://twitter.com/TheCreator1337_", true);
        testEmbed.addField("Twitch", "https://www.twitch.tv/thecreator133769", true);
        testEmbed.addField("Reddit", "https://www.reddit.com/user/TheCreator_1337", true);
        testEmbed.setFooter("Please follow me, I need the gratification!");
        message.channel.send(testEmbed);
    }
};
