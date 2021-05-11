import * as Index from "../../index";

module.exports = {
    name: "ping",
    description: "Checks the bot's ping.",
    syntax: "ping",
    min_args: 0,
    admin_only: false,
    execute(message: any, args: string[]) {
        message.channel.send("My ping is: __" + Index.client.ws.ping + "ms__!");
    }
};
