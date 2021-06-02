import {Message} from "discord.js";
import * as Index from "../../index";
import {CreativeCommand} from "../../scripts/commanddef";

export class PingCommand implements CreativeCommand {
    name = "ping";
    description = "Checks the bot's ping";
    syntax = "ping";
    min_args = 0;
    admin_only = false;
    guild_only = false;

    execute(message: Message, args: string[]): void {
        message.channel.send("My ping is: __" + Index.client.ws.ping + "ms__!");
    }
}
