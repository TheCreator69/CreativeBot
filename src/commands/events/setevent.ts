import * as EventHandler from "../../scripts/eventhandler";
import {CreativeCommand, ArgsCheckResult, CommandExecutionInfo} from "../../scripts/commanddef";
import {Message} from "discord.js";

export class SetEventCommand implements CreativeCommand {
    name = "setevent";
    description = "Sets a server's event channel or deletes the event association of the current event channel";
    syntax = "setevent <channel ID/delete>";
    min_args = 1;
    admin_only = true;
    guild_only = true;

    async checkRequiredArgs(args: string[], commandExecutionInfo: CommandExecutionInfo | undefined): Promise<ArgsCheckResult> {
        if(args[0] === "delete") {
            return {valid: true};
        }
        else {
            var channelIDAsNumber = Number(args[0]);
            if(isNaN(channelIDAsNumber)) {
                return {valid: false, replyMessage: "You need to enter a number as a channel ID!"};
            }
            //@ts-ignore
            var commandGuild = commandExecutionInfo.client.guilds.cache.get(args[0]);
            //@ts-ignore
            if(commandGuild.channels.cache.get(args[0]) === undefined) {
                return {valid: false, replyMessage: "Couldn't find channel by ID!"};
            }
            return {valid: true};
        }
    }

    async execute(message: Message, args: string[]): Promise<void> {
        //@ts-ignore
        const serverID = BigInt(message.guild.id);
        const channelEntry = await EventHandler.getEventChannel(serverID);

        if(channelEntry !== null && args[0] === "delete") {
            EventHandler.deleteEventChannel(serverID);
            message.channel.send("Previous event channel is no longer considered an event channel!");
            return;
        }

        //BigInt needed, as Number isn't large enough to handle Snowflakes. Oof.
        var channelID = BigInt(args[0]);
        if(channelEntry === null) {
            await EventHandler.createEventChannel(serverID, channelID);
            message.channel.send("Set up new event channel!");
            return;
        }

        await EventHandler.changeEventChannel(serverID, channelID);
        message.channel.send("Changed current event channel!");
        return;
    }
}
