module.exports = {
    name: "reply",
    description: "Replies to the command sender with a nice message!",
    syntax: "reply",
    execute(message, args) {
        message.reply('Thank you for talking to me :smile:');
    }
};
