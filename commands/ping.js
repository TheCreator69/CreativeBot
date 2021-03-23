module.exports = {
    name: 'ping',
    description: "A simple text-based command, passes a ball back to the sender.",
    execute(message, args){
        message.channel.send(':ping_pong: pong!');
    }
};
