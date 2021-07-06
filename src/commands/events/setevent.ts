import * as EventHandler from "../../scripts/database/eventhandler";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import {Message} from "discord.js";
import * as Localizer from "../../scripts/localizer";

export class SetEventCommand implements CreativeCommand {
    name = Localizer.translate("setevent.name");
    description = Localizer.translate("setevent.description");
    syntax = Localizer.translate("setevent.syntax");
    minArgs = 1;
    adminOnly = true;
    guildOnly = true;

    async checkRequiredArgs(args: string[], message: Message | undefined): Promise<ArgsCheckResult> {
        if(args[0] === "delete") {
            return {valid: true};
        }
        else {
            var channelIDAsNumber = Number(args[0]);
            if(isNaN(channelIDAsNumber)) {
                return {valid: false, replyMessage: Localizer.translate("setevent.arg0NaN")};
            }
            //@ts-ignore
            if(message.guild.channels.cache.get(args[0]) === undefined) {
                return {valid: false, replyMessage: Localizer.translate("setevent.invalidChannel")};
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
            message.channel.send(Localizer.translate("setevent.deletedChannel"));
            return;
        }

        //BigInt needed, as Number isn't large enough to handle Snowflakes. Oof.
        var channelID = BigInt(args[0]);
        if(channelEntry === null) {
            await EventHandler.createEventChannel(serverID, channelID);
            message.channel.send(Localizer.translate("setevent.addedChannel"));
            return;
        }

        await EventHandler.changeEventChannel(serverID, channelID);
        message.channel.send(Localizer.translate("setevent.changedChannel"));
        return;
    }
}
