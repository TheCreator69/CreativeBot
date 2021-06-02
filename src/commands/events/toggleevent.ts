import * as EventHandler from "../../scripts/eventhandler";
import {CreativeCommand, ArgsCheckResult, CommandExecutionInfo} from "../../scripts/commanddef";
import {Message} from "discord.js";

export class ToggleEventCommand implements CreativeCommand {
    name = "toggleevent";
    description = "Turns the event channel for a server on or off, allowing or disallowing submissions to be posted to said channel";
    syntax = "toggleevent <on/off>";
    min_args = 1;
    admin_only = true;
    guild_only = true;

    async checkRequiredArgs(args: string[], commandExecutionInfo: CommandExecutionInfo | undefined): Promise<ArgsCheckResult> {
        if(args[0] !== "on" && args[0] !== "off") {
            return {valid: false, replyMessage: "Please type either \"on\" or \"off\"!"};
        }
        const guildID = BigInt(commandExecutionInfo?.guildID);
        const channelEntry = await EventHandler.getEventChannel(guildID);
        if(channelEntry === null) {
            return {valid: false, replyMessage: "This server doesn't have an event channel!"};
        }
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
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
}
