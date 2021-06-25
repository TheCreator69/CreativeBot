import {MessageEmbed, Message} from "discord.js";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export class TokenSystemCommand implements CreativeCommand {
    name = Localizer.translate("tokensystem.name");
    description = Localizer.translate("tokensystem.description");
    syntax = Localizer.translate("tokensystem.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

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
