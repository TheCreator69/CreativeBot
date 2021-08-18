import {MessageEmbed, Message} from "discord.js";
import {CreativeCommand} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import {LogChamp, Category} from "../../scripts/logchamp";

var logChampInst = new LogChamp(Category.BotMessage);

export class TokenSystemCommand implements CreativeCommand {
    name = Localizer.translate("tokensystem.name");
    description = Localizer.translate("tokensystem.description");
    syntax = Localizer.translate("tokensystem.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    execute(message: Message, args: string[]): void {
        message.channel.send(this.constructEmbed());
    }

    constructEmbed(): MessageEmbed {
        const tokenEmbed = new MessageEmbed();
        tokenEmbed.setColor("#ffff00");
        tokenEmbed.setTitle(Localizer.translate("tokensystem.embedTitle"));
        tokenEmbed.setDescription(Localizer.translate("tokensystem.embedDescription"));

        logChampInst.debug("Constructed tokensystem embed");
        return tokenEmbed;
    }
}
