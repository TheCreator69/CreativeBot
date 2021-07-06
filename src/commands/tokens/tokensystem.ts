import {MessageEmbed, Message} from "discord.js";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

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
        return tokenEmbed;
    }
}
