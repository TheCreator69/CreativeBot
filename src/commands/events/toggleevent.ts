import * as EventHandler from "../../scripts/eventhandler";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import {Message} from "discord.js";
import * as Localizer from "../../scripts/localizer";

export class ToggleEventCommand implements CreativeCommand {
    name = Localizer.translate("toggleevent.name");
    description = Localizer.translate("toggleevent.description");
    syntax = Localizer.translate("toggleevent.syntax");
    min_args = 1;
    admin_only = true;
    guild_only = true;

    async checkRequiredArgs(args: string[], message: Message | undefined): Promise<ArgsCheckResult> {
        if(args[0] !== "on" && args[0] !== "off") {
            return {valid: false, replyMessage: Localizer.translate("toggleevent.invalidArg0")};
        }
        //@ts-ignore
        const guildID = BigInt(message.guild.id);
        const channelEntry = await EventHandler.getEventChannel(guildID);
        if(channelEntry === null) {
            return {valid: false, replyMessage: Localizer.translate("toggleevent.noEventChannel")};
        }
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        if(message.guild === null) return;
        const guildID = BigInt(message.guild.id);
        if(args[0] === "on") {
            EventHandler.setEventChannelActivity(guildID, true);
            message.channel.send(Localizer.translate("toggleevent.enabledEventChannel"));
            return;
        }
        else if(args[0] === "off") {
            EventHandler.setEventChannelActivity(guildID, false);
            message.channel.send(Localizer.translate("toggleevent.disabledEventChannel"));
            return;
        }
    }
}
