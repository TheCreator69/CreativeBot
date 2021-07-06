import {Message} from "discord.js";
import * as Index from "../../index";
import {CreativeCommand} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";

export class PingCommand implements CreativeCommand {
    name = Localizer.translate("ping.name");
    description = Localizer.translate("ping.description");
    syntax = Localizer.translate("ping.syntax");
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    execute(message: Message, args: string[]): void {
        message.channel.send(Localizer.translate("ping.pingMessage", {ping: Index.client.ws.ping}));
    }
}
