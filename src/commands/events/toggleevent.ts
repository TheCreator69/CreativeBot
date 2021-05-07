import * as EventHandler from "../../scripts/eventhandler";

module.exports = {
    name: "toggleevent",
    description: "Turn the event channel for a server on or off.",
    syntax: "toggleevent <on/off>",
    min_args: 1,
    admin_only: true,
    async execute(message, args) {
        if(!message.guild) {
            message.channel.send("Please send this command in a server with an active event channel!");
            return;
        }
        const channelEntry = await EventHandler.getEventChannel(message.guild.id);
        if(channelEntry === null) {
            message.channel.send("This Discord doesn't have an event channel!");
            return;
        }
        if(args[0] === "on") {
            EventHandler.setEventChannelActivity(message.guild.id, true);
            message.channel.send("Event channel has been enabled!");
            return;
        }
        else if(args[0] === "off") {
            EventHandler.setEventChannelActivity(message.guild.id, false);
            message.channel.send("Event channel has been disabled!");
            return;
        }
        else {
            message.channel.send("Please type either \"on\" or \"off\"!");
            return;
        }
    }
};
