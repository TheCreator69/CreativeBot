const Index = require("../../index.js");

module.exports = {
    name: "thumbsup",
    description: "Mention a user whose last message will get a thumbs up reaction from the bot :thumbsup:",
    syntax: "thumbsup <user mention>",
    execute(message, args) {
        if(!args[0]) {
            message.channel.send("You need to specifiy a user I can react to!");
            return;
        }
        var mentionedUser = getUserFromMention(args[0]);
        if(mentionedUser === undefined) {
            message.channel.send("You just specified an invalid user! Who am I supposed to react to? :frowning:");
        }
        reactToLastMessageFromMentionedUser(message, mentionedUser);
    }
};

function getUserFromMention(mention) {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if(!matches) {
        return;
    }
    const id = matches[1];
    return Index.client.users.cache.get(id);
}

function reactToLastMessageFromMentionedUser(message, mentionedUser) {
    message.channel.messages.fetch().then(function(messageMap) {
        var messagesByMentionedUser = messageMap.filter(m => m.author.id == mentionedUser.id);
        if(!messagesByMentionedUser.size) {
            message.channel.send("This user hasn't posted here in a while, I can't react to them :flushed:");
            return;
        }
        messagesByMentionedUser.first().react("👍");
    });
}
