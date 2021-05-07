import * as EventHandler from "../../scripts/eventhandler";

module.exports = {
    name: "setevent",
    description: "Set a server's event channel or delete it.",
    syntax: "setevent <channelID/delete>",
    min_args: 1,
    admin_only: true,
    async execute(message, args) {
        if(!message.guild || !message.guild.available) {
            message.channel.send("Please send this command in an available server!");
            return;
        }
        const serverID = message.guild.id;
        const channelEntry = await EventHandler.getEventChannel(serverID);
        if(channelEntry !== null && args[0] === "delete") {
            EventHandler.deleteEventChannel(serverID);
            message.channel.send("Deleted event channel!");
            return;
        }
        if(isNaN(args[0])) {
            message.channel.send("You need to enter a number as a channel ID!");
            return;
        }
        if(message.guild.channels.cache.get(args[0]) === undefined) {
            message.channel.send("Couldn't find channel by ID!");
            return;
        }
        if(channelEntry === null) {
            await EventHandler.createEventChannel(serverID, args[0]);
            message.channel.send("Set up event channel!");
            return;
        }
        await EventHandler.changeEventChannel(serverID, args[0]);
        message.channel.send("Changed event channel!");
        return;
    }
};
