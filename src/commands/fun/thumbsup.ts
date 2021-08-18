import {Message, User} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import {getUserFromMention} from "../../scripts/discordutil";
import * as Localizer from "../../scripts/localizer";
import {LogChamp, Category} from "../../scripts/logchamp";

var logChampInst = new LogChamp(Category.TextProcessing);

export class ThumbsupCommand implements CreativeCommand {
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
