const Index = require("../../index.js");
const config = require("../../config.json");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "submit",
    description: "Submits an entry for the current event in the event channel.",
    syntax: "submit <link> <description>",
    admin_only: false,
    execute(message, args) {
        if(!config.event_channel_id) {
            message.channel.send("There is no event running currently, so you can't submit anything!");
            return;
        }
        if(args.length < 2) {
            message.channel.send("You need to enter a link and a description of at least one word!");
            return;
        }
        const eventChannel = Index.client.channels.cache.get(config.event_channel_id);
        var description = "";
        for(var i = 1; i < args.length; i++) {
            description += args[i] + " ";
        }
        const submissionEmbed = createSubmissionEmbed("__**Submission by " + message.author.username + ":**__", "*Link to Content:* " + args[0] + "\n*Description:* " + description, message.author);
        eventChannel.send(submissionEmbed);
    }
};

function createSubmissionEmbed(title, description, author) {
    var submissionEmbed = new MessageEmbed();
    submissionEmbed.setColor("#4444ff");
    submissionEmbed.setTitle(title);
    submissionEmbed.setDescription(description);
    submissionEmbed.setThumbnail(author.displayAvatarURL({format: "png", dynamic: true}));
    return submissionEmbed;
}
