import {Message} from "discord.js";
import * as Index from "../../index";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export class PingCommand implements CreativeCommand {
    name = Localizer.translate("ping.name");
    description = Localizer.translate("ping.description");
    syntax = Localizer.translate("ping.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    execute(message: Message, args: string[]): void {
        message.channel.send("My ping is: __" + Index.client.ws.ping + "ms__!");
    }
}
