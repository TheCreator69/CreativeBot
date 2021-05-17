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

export async function checkRequiredArgs(message: Message, args: string[]): Promise<boolean> {
    if(!message.guild || !message.guild.available) {
        message.channel.send("Please send this command in an available server!");
        return false;
    }
    if(args[0] !== "on" && args[0] !== "off") {
        message.channel.send("Please type either \"on\" or \"off\"!");
        return false;
    }
    const guildID = BigInt(message.guild.id);
    const channelEntry = await EventHandler.getEventChannel(guildID);
    if(channelEntry === null) {
        message.channel.send("This server doesn't have an event channel!");
        return false;
    }
    return true;
}

export async function execute(message: Message, args: string[]): Promise<void> {
    if(message.guild === null) return;
    const guildID = BigInt(message.guild.id);
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
}
