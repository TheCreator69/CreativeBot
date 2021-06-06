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
        changelogEmbed.setTitle(":bell: New in Version 1.1!");
        changelogEmbed.setDescription(this.constructListOfChanges());
        changelogEmbed.setFooter("Last updated on: 4th July 2021");
        return changelogEmbed;
    }

    constructListOfChanges(): string {
        var listOfChanges = "";
        for(let changeEntry of this.changes) {
            listOfChanges += changeEntry + "\n";
        }
        return listOfChanges;
    }

    changes = [
        "**Added** this very command!",
        "**Replaced** old credits banner with new sleek one. \nThis also fixed the issues with names not fitting inside of it."
    ];
}
