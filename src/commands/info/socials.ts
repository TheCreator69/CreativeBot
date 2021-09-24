import {MessageEmbed, Message} from "discord.js";
import {CreativeCommand} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import {LogChamp, Category} from "../../scripts/logchamp";

var logChampInst = new LogChamp(Category.BotMessage);

export class SocialsCommand implements CreativeCommand {
    name = Localizer.translate("socials.name");
    description = Localizer.translate("socials.description");
    syntax = Localizer.translate("socials.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    execute(message: Message, args: string[]): void {
        //@ts-ignore
        message.channel.send({embeds: [this.constructEmbed()]});
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

        logChampInst.debug("Socials embed constructed");
        return socialEmbed;
    }
}
