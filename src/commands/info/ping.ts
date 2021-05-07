import * as Index from "../../index";

module.exports = {
    name: "ping",
    description: "Checks the bot's ping.",
    syntax: "ping",
    min_args: 0,
    admin_only: false,
    execute(message, args) {
        message.channel.send("My ping is: " + Index.client.ws.ping + "ms! ");
    }
};
