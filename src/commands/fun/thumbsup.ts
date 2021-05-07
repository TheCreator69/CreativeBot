import * as Index from "../../index";

module.exports = {
    name: "thumbsup",
    description: "Mention a user whose last message will get a thumbs up reaction from the bot :thumbsup:",
    syntax: "thumbsup <user mention>",
    min_args: 1,
    admin_only: false,
    execute(message: any, args: string[]) {
        reactToMentionedUserIfValid(message, args);
    }
};

function reactToMentionedUserIfValid(message: any, args: string[]) {
    var mentionedUser = getUserFromMention(args[0]);
    if(mentionedUser === undefined) {
        message.channel.send("You just specified an invalid user! Who am I supposed to react to? :frowning:");
    }
    reactToLastMessageFromMentionedUser(message, mentionedUser);
}

function getUserFromMention(mention: any) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if(!matches) {
        return;
    }
    const id = matches[1];
    return Index.client.users.cache.get(id);
}

function reactToLastMessageFromMentionedUser(message: any, mentionedUser: any) {
    message.channel.messages.fetch().then(function(messageMap: any) {
        var messagesByMentionedUser = messageMap.filter((m: any) => m.author.id == mentionedUser.id);
        if(!messagesByMentionedUser.size) {
            message.channel.send("This user hasn't posted here in a while, I can't react to them :flushed:");
            return;
        }
        messagesByMentionedUser.first().react("👍");
    });
}