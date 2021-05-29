import * as Index from "../../index";
import {Message, User} from "discord.js";
import {CreativeCommand} from "../../scripts/commanddef";

export class Command implements CreativeCommand {
    name = "thumbsup";
    description = "Gives the user mentioned a thumbs up on their last message :thumbsup:";
    syntax = "thumbsup <user mention>";
    min_args = 1;
    admin_only = false;

    async checkRequiredArgs(message: Message, args: string[]): Promise<boolean> {
        var mentionedUser = this.getUserFromMention(args[0]);
        if(mentionedUser === undefined) {
            message.channel.send("You just specified an invalid user! Who am I supposed to react to? :frowning:");
            return false;
        }
        return true;
    }

    execute(message: Message, args: string[]): void {
        var mentionedUser = this.getUserFromMention(args[0]);
        if(mentionedUser === undefined) return;
        this.reactToLastMessageFromMentionedUser(message, mentionedUser);
    }

    getUserFromMention(mention: string): User | undefined {
        const matches = mention.match(/^<@!?(\d+)>$/);
        if(!matches) {
            return;
        }
        const id = matches[1];
        return Index.client.users.cache.get(id);
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
