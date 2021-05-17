import {MessageEmbed, Message} from "discord.js";
import {CreativeCommandAttributes} from "../../scripts/commanddef";

export var info: CreativeCommandAttributes = {
    name: "socials",
    description: "Lists TheCreator's socials.",
    syntax: "socials",
    min_args: 0,
    admin_only: false,
}

export function execute(message: Message, args: string[]) {
    message.channel.send(constructEmbed());
}

function constructEmbed() {
    const socialEmbed = new MessageEmbed();
    socialEmbed.setColor("#ff0000");
    socialEmbed.setTitle("Follow me on social media!");
    socialEmbed.setDescription("I post little to nothing, but seeing my follower count increase is incredibly satisfying.");
    socialEmbed.setAuthor("TheCreator", "https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA");
    socialEmbed.setThumbnail("https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo");
    socialEmbed.addField("YouTube", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA", true);
    socialEmbed.addField("Twitter", "https://twitter.com/TheCreator1337_", true);
    socialEmbed.addField("Twitch", "https://www.twitch.tv/thecreator133769", true);
    socialEmbed.addField("Reddit", "https://www.reddit.com/user/TheCreator_1337", true);
    socialEmbed.setFooter("Please follow me, I need the gratification!");
    return socialEmbed;
}
