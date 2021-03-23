module.exports = {
    name: 'rekt',
    description: "Force the bot to send a wonderful image.",
    execute(message, args) {
        const attachment = new MessageAttachment("http://www.nag.co.za/wp-content/uploads/2014/09/rekt-mate.jpg");
        message.channel.send(attachment);
    }
};
