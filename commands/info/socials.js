const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "socials",
    description: "Lists ***REMOVED***'s socials in an embed.",
    syntax: "socials",
    admin_only: false,
    execute(message, args) {
        message.channel.send(constructEmbed());
    }
};

function constructEmbed() {
    const socialEmbed = new MessageEmbed();
    socialEmbed.setColor("#ff0000");
    socialEmbed.setTitle("Follow me on social media!");
    socialEmbed.setDescription("I post little to nothing, but seeing my follower count increase is incredibly satisfying.");
    socialEmbed.setAuthor("***REMOVED***", "https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA");
    socialEmbed.setThumbnail("https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo");
    socialEmbed.addField("YouTube", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA", true);
    socialEmbed.addField("Twitter", "https://twitter.com/***REMOVED***1337_", true);
    socialEmbed.addField("Twitch", "https://www.twitch.tv/thecreator133769", true);
    socialEmbed.addField("Reddit", "https://www.reddit.com/user/***REMOVED***_1337", true);
    socialEmbed.setFooter("Please follow me, I need the gratification!");
    return socialEmbed;
}
