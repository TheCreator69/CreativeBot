import {Message, CommandInteraction} from "discord.js";
import * as Index from "../../index";
import {CreativeCommand} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import {LogChamp, Category} from "../../scripts/logchamp";
import {SlashCommandBuilder} from "@discordjs/builders";

var logChampInst = new LogChamp(Category.BotMessage);

export class PingCommand implements CreativeCommand {
    commandBuilder = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the bot's current ping");
    data = this.commandBuilder;
    name = Localizer.translate("ping.name");
    description = Localizer.translate("ping.description");
    syntax = Localizer.translate("ping.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    execute(message: Message, args: string[]): void {
        var ping = Index.client.ws.ping;
        message.channel.send(Localizer.translate("ping.pingMessage", {ping: ping}));
        logChampInst.debug("Ping retrieved", {ping: ping});
    }

    async executeInteraction(interaction: CommandInteraction): Promise<void> {

    }
}
