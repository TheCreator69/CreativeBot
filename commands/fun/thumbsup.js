module.exports = {
    name: "thumbsup",
    description: "Reacts to your bot command message with a :thumbsup:",
    syntax: "thumbsup",
    execute(message, args) {
        message.react("👍");
    }
};
