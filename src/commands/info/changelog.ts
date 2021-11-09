import {CreativeCommand} from "../../scripts/def/commanddef";
import {Message, MessageEmbed, CommandInteraction} from "discord.js";
import * as Localizer from "../../scripts/localizer";
import {LogChamp, Category} from "../../scripts/logchamp";
import {SlashCommandBuilder} from "@discordjs/builders";

var logChampProcInst = new LogChamp(Category.TextProcessing);

export class ChangelogCommand implements CreativeCommand {
    commandBuilder = new SlashCommandBuilder()
    .setName("changelog")
    .setDescription("Displays changes over different versions of Creative Bot");
    data = this.commandBuilder;
    name = Localizer.translate("changelog.name");
    aliases = Localizer.translateArray("changelog.aliases");
    description = Localizer.translate("changelog.description");
    syntax = Localizer.translate("changelog.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    execute(message: Message, args: string[]): void {
        //@ts-ignore
        message.channel.send({embeds: [this.constructChangelogEmbed()]});
    }

    async executeInteraction(interaction: CommandInteraction): Promise<void> {

    }

    constructChangelogEmbed(): MessageEmbed {
        const changelogEmbed = new MessageEmbed();
        changelogEmbed.setColor("#ffff00");
        changelogEmbed.setTitle(Localizer.translate("changelog.embedTitle"));
        changelogEmbed.setDescription(Localizer.translate("changelog.embedDescription"));
        changelogEmbed.addField(Localizer.translate("changelog.field1_1_1Title"), this.constructListOfChangesFromArray(Localizer.translateArray("changelog.changelog1_1_1")));
        changelogEmbed.addField(Localizer.translate("changelog.field1_1Title"), this.constructListOfChangesFromArray(Localizer.translateArray("changelog.changelog1_1")));

        logChampProcInst.debug("Changelog embed constructed!");
        return changelogEmbed;
    }

    constructListOfChangesFromArray(array: string[]): string {
        var listOfChanges = "";
        var changeArray: string[] = Object.values(array);
        for(let changeEntry of changeArray) {
            listOfChanges += changeEntry + "\n";
        }

        logChampProcInst.debug("Changelog list constructed", {list: listOfChanges});
        return listOfChanges;
    }
}
