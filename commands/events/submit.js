const Index = require("../../index.js");
const config = require("../../config.json");
const {MessageEmbed} = require("discord.js");
const EventHandler = require("../../scripts/eventhandler.js");

module.exports = {
    name: "submit",
    description: "Submits an entry for the current event in the event channel.",
    syntax: "submit <link> <description>",
    min_args: 2,
    admin_only: false,
    async execute(message, args) {
        if(!message.guild) {
            message.channel.send("Please send this command in a server with an active event channel!");
            return;
        }
        const channelEntry = await EventHandler.getEventChannelForGuild(message.guild.id);
        if(channelEntry === null) {
            message.channel.send("This Discord doesn't have an event channel!");
            return;
        }
        if(!await EventHandler.getIfEventChannelIsActive(channelEntry)) {
            message.channel.send("There is currently no active event. Please return later.");
            return;
        }
        constructAndSendSubmissionEmbed(message, args);
    }
};

function constructAndSendSubmissionEmbed(message, args) {
    var description = constructSubmissionDescription(args);
    const submissionTitle = "__**Submission by " + message.author.username + ":**__";
    const submissionDescription = "*Link to Content:* " + args[0] + "\n*Description:* " + description;
    const submissionEmbed = constructSubmissionEmbed(submissionTitle, submissionDescription, message.author);
    const eventChannel = Index.client.channels.cache.get(config.event_channel_id);
    eventChannel.send(submissionEmbed);
}

function constructSubmissionDescription(args) {
    var description = "";
    for(var i = 1; i < args.length; i++) {
        description += args[i] + " ";
    }
    return description;
}

function constructSubmissionEmbed(title, description, author) {
    var submissionEmbed = new MessageEmbed();
    submissionEmbed.setColor("#4444ff");
    submissionEmbed.setTitle(title);
    submissionEmbed.setDescription(description);
    submissionEmbed.setThumbnail(author.displayAvatarURL({format: "png", dynamic: true}));
    return submissionEmbed;
}
