import {CreativeCommand} from "../../scripts/commanddef";
import {Message, MessageEmbed} from "discord.js";
import * as Localizer from "../../scripts/localizer";

export class ChangelogCommand implements CreativeCommand {
    name = Localizer.translate("changelog.name");
    description = Localizer.translate("changelog.description");
    syntax = Localizer.translate("changelog.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    execute(message: Message, args: string[]): void {
        message.channel.send(this.constructChangelogEmbed());
    }

    constructChangelogEmbed(): MessageEmbed {
        const changelogEmbed = new MessageEmbed();
        changelogEmbed.setColor("#ffff00");
        changelogEmbed.setTitle(Localizer.translate("changelog.embedTitle"));
        changelogEmbed.setDescription(this.constructListOfChanges());
        changelogEmbed.setFooter(Localizer.translate("changelog.embedFooter"));
        return changelogEmbed;
    }

    constructListOfChanges(): string {
        var listOfChanges = "";
        var changeArray: string[] = Object.values(Localizer.translateArray("changelog.changelog"));
        for(let changeEntry of changeArray) {
            listOfChanges += changeEntry + "\n";
        }
        return listOfChanges;
    }
}
