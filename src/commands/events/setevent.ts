import * as EventHandler from "../../scripts/eventhandler";

module.exports = {
    name: "setevent",
    description: "Set a server's event channel or delete it.",
    syntax: "setevent <channelID/delete>",
    min_args: 1,
    admin_only: true,
    async execute(message: any, args: string[]) {
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
        //BigInt needed, as Number isn't large enough to handle Snowflakes. Oof.
        var channelID = BigInt(args[0]);
        var channelIDAsNumber = Number(args[0]);
        if(isNaN(channelIDAsNumber)) {
            message.channel.send("You need to enter a number as a channel ID!");
            return;
        }
        if(message.guild.channels.cache.get(args[0]) === undefined) {
            message.channel.send("Couldn't find channel by ID!");
            return;
        }
        if(channelEntry === null) {
            await EventHandler.createEventChannel(serverID, channelID);
            message.channel.send("Set up event channel!");
            return;
        }
        await EventHandler.changeEventChannel(serverID, channelID);
        message.channel.send("Changed event channel!");
        return;
    }
};
