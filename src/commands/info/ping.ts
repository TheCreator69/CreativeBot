import {Message} from "discord.js";
import * as Index from "../../index";
import {CreativeCommandAttributes} from "../../scripts/commanddef";

export var info: CreativeCommandAttributes = {
    name: "ping",
    description: "Checks the bot's ping.",
    syntax: "ping",
    min_args: 0,
    admin_only: false,
}

export function execute(message: Message, args: string[]) {
    message.channel.send("My ping is: __" + Index.client.ws.ping + "ms__!");
}
