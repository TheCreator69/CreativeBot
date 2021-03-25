module.exports = {
    name: "ping",
    description: "Respond with a 'Pong!' and an emote.",
    syntax: "ping",
    execute(message, args) {
        message.channel.send(':ping_pong: Pong!');
    }
};
