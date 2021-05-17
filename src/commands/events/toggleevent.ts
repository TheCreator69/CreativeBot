import * as EventHandler from "../../scripts/eventhandler";
import {CreativeCommandAttributes} from "../../scripts/commanddef";
import {Message} from "discord.js";

export var info: CreativeCommandAttributes = {
    name: "toggleevent",
    description: "Turns the event channel for a server on or off, allowing or disallowing submissions to be posted to said channel.",
    syntax: "toggleevent <on/off>",
    min_args: 1,
    admin_only: true,
}

export async function execute(message: Message, args: string[]) {
    if(!message.guild || !message.guild.available) {
        message.channel.send("Please send this command in an available server!");
        return;
    }
    const guildID = BigInt(message.guild.id);
    const channelEntry = await EventHandler.getEventChannel(guildID);
    if(channelEntry === null) {
        message.channel.send("This server doesn't have an event channel!");
        return;
    }
    if(args[0] === "on") {
        EventHandler.setEventChannelActivity(guildID, true);
        message.channel.send("Event channel has been enabled!");
        return;
    }
    else if(args[0] === "off") {
        EventHandler.setEventChannelActivity(guildID, false);
        message.channel.send("Event channel has been disabled!");
        return;
    }
    else {
        message.channel.send("Please type either \"on\" or \"off\"!");
        return;
    }
}
