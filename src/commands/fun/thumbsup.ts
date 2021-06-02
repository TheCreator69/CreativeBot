import {Message, User} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import {getUserFromMention} from "../../scripts/discordutil";

export class ThumbsupCommand implements CreativeCommand {
    name = "thumbsup";
    description = "Gives the user mentioned a thumbs up on their last message :thumbsup:";
    syntax = "thumbsup <user mention>";
    min_args = 1;
    admin_only = false;
    guild_only = false;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        var mentionedUser = getUserFromMention(args[0]);
        if(mentionedUser === undefined) {
            return {valid: false, replyMessage: "You just specified an invalid user! Who am I supposed to react to? :frowning:"};
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
                message.channel.send("This user hasn't posted here in a while, I can't react to them :flushed:");
                return;
            }
            messagesByMentionedUser.first().react("👍");
        });
    }
}
