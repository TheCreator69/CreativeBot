//import * as LogChamp from "../../scripts/logchamp";
import {Message, CommandInteraction} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import {SlashCommandBuilder} from "@discordjs/builders";

export class TestCommand implements CreativeCommand {
    commandBuilder = new SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command for bot development");
    data = this.commandBuilder;
    name = Localizer.translate("test.name");
    aliases = Localizer.translateArray("test.aliases");
    description = Localizer.translate("test.description");
    syntax = Localizer.translate("test.syntax");
    minArgs = 0;
    adminOnly = true;
    guildOnly = false;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        return {valid: true};
    }

    execute(message: Message, args: string[]): void {
        //Nothing to test.
    }

    async executeInteraction(interaction: CommandInteraction): Promise<void> {
        await interaction.reply("Test!");
    }
}
