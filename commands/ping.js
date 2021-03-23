module.exports = {
    name: 'ping',
    description: "A simple text-based command, replies to the sender with 'Pong'.",
    execute(message, args){
        message.channel.send(':ping_pong: pong!');
    }
};
