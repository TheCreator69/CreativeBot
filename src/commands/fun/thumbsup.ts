import {Message, User} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import {getUserFromMention} from "../../scripts/discordutil";
import * as Localizer from "../../scripts/localizer";

export class ThumbsupCommand implements CreativeCommand {
    name = Localizer.translate("thumbsup.name");
    description = Localizer.translate("thumbsup.description");
    syntax = Localizer.translate("thumbsup.syntax");
    min_args = 1;
    admin_only = false;
    guild_only = false;

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
                return;
            }
            messagesByMentionedUser.first().react("👍");
        });
    }
}
