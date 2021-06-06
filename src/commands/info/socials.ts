import {MessageEmbed, Message} from "discord.js";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export class SocialsCommand implements CreativeCommand {
    name = Localizer.translate("socials.name");
    description = Localizer.translate("socials.description");
    syntax = Localizer.translate("socials.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    execute(message: Message, args: string[]): void {
        message.channel.send(this.constructEmbed());
    }

    constructEmbed(): MessageEmbed {
        const socialEmbed = new MessageEmbed();
        socialEmbed.setColor("#ff0000");
        socialEmbed.setTitle(Localizer.translate("socials.embedTitle"));
        socialEmbed.setDescription(Localizer.translate("socials.embedDescription"));
        socialEmbed.setAuthor("TheCreator", "https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA");
        socialEmbed.setThumbnail("https://lh3.googleusercontent.com/a-/AOh14GgyWf-iAzQRRgAVsacRifDpMN6_IOkV7w9Q1Lqu=s600-k-no-rp-mo");
        socialEmbed.addField("YouTube", "https://www.youtube.com/channel/UC1U-tRxYC7sr1kd-Q92iyHA", true);
        socialEmbed.addField("Twitter", "https://twitter.com/TheCreator1337_", true);
        socialEmbed.addField("Twitch", "https://www.twitch.tv/thecreator133769", true);
        socialEmbed.addField("Reddit", "https://www.reddit.com/user/TheCreator_1337", true);
        socialEmbed.setFooter(Localizer.translate("socials.embedFooter"));
        return socialEmbed;
    }
}
