import * as Index from "../../index";
import {MessageEmbed, TextChannel, Message, User} from "discord.js";
import * as EventHandler from "../../scripts/eventhandler";
import * as UIFunctions from "../../scripts/uifunctions";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";

export class SubmitCommand implements CreativeCommand {
    name = "submit";
    description = "Submits an entry for the current event in the server's event channel";
    syntax = "submit <link> <description>";
    min_args = 2;
    admin_only = false;
    guild_only = true;

    async checkRequiredArgs(args: string[], message: Message | undefined): Promise<ArgsCheckResult> {
        //@ts-ignore
        const channelEntry = await EventHandler.getEventChannel(message.guild.id);
        if(channelEntry === null) {
            return {valid: false, replyMessage: "This server doesn't have an event channel!"};
        }
        if(!EventHandler.checkIfEventChannelIsActive(channelEntry)) {
            return {valid: false, replyMessage: "There is currently no active event. Please return later."};
        }
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        if(message.guild === null) return;
        const channelEntry = await EventHandler.getEventChannel(BigInt(message.guild.id));
        this.constructAndSendSubmissionEmbed(message, args, channelEntry.eventChannelID);
        message.channel.send("Posted submission in event channel!");
    }

    constructAndSendSubmissionEmbed(message: Message, args: string[], channelID: bigint): void {
        var description = UIFunctions.createStringFromArray(args, 1);
        const submissionTitle = "__**Submission by " + message.author.username + ":**__";
        const submissionDescription = "*Link to Content:* " + args[0] + "\n*Description:* " + description;
        const submissionEmbed = this.constructSubmissionEmbed(submissionTitle, submissionDescription, message.author);
        var channelIDKey = channelID.toString();
        const eventChannel = Index.client.channels.cache.get(channelIDKey) as TextChannel;
        if(eventChannel !== undefined) {
            eventChannel.send(submissionEmbed);
        }
    }

    constructSubmissionEmbed(title: string, description: string, author: User): MessageEmbed {
        var submissionEmbed = new MessageEmbed();
        submissionEmbed.setColor("#4444ff");
        submissionEmbed.setTitle(title);
        submissionEmbed.setDescription(description);
        submissionEmbed.setThumbnail(author.displayAvatarURL({format: "png", dynamic: true}));
        return submissionEmbed;
    }
}
