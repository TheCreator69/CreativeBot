import {Message, User, CommandInteraction} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import {getUserFromMention} from "../../scripts/discordutil";
import * as Localizer from "../../scripts/localizer";
import {LogChamp, Category} from "../../scripts/logchamp";
import {SlashCommandBuilder} from "@discordjs/builders";

var logChampInst = new LogChamp(Category.TextProcessing);

export class ThumbsupCommand implements CreativeCommand {
    commandBuilder = new SlashCommandBuilder()
    .setName("thumbsup")
    .setDescription("Gives the last message of the user a thumbs up");
    data = this.commandBuilder;
    name = Localizer.translate("thumbsup.name");
    description = Localizer.translate("thumbsup.description");
    syntax = Localizer.translate("thumbsup.syntax");
    minArgs = 1;
    adminOnly = false;
    guildOnly = false;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        var mentionedUser = getUserFromMention(args[0]);
        if(mentionedUser === undefined) {
            return {valid: false, replyMessage: Localizer.translate("thumbsup.invalidUser")};
        }
        return {valid: true};
    }

    execute(message: Message, args: string[]): void {
        var mentionedUser = getUserFromMention(args[0]);
        if(mentionedUser === undefined) return;
        this.reactToLastMessageFromMentionedUser(message, mentionedUser);
    }

    async executeInteraction(interaction: CommandInteraction): Promise<void> {

    }

    reactToLastMessageFromMentionedUser(message: Message, mentionedUser: User): void {
        message.channel.messages.fetch().then(function(messageMap: any) {
            var messagesByMentionedUser = messageMap.filter((m: any) => m.author.id == mentionedUser.id);
            if(!messagesByMentionedUser.size) {
                message.channel.send(Localizer.translate("thumbsup.cantFindLastMessage"));
                logChampInst.debug("Couldn't find last message from specified user", {user: mentionedUser.username});
                return;
            }
            messagesByMentionedUser.first().react("👍");
        });
    }
}
