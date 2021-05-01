const CreditsHandler = require("../../scripts/creditshandler.js");
const LogChamp = require("../../scripts/logchamp.js");

module.exports = {
    name: "changecredits",
    description: "Change or set credits for a specific user",
    syntax: "changecredits <add/remove/set> <amount> <user mention>",
    min_args: 3,
    admin_only: true,
    async execute(message, args) {
        if(args[0] !== "add" && args[0] !== "remove" && args[0] !== "set") {
            message.channel.send("Please use either \"add\", \"remove\" or \"set\" to change a user's credits!");
            return;
        }
        if(isNaN(args[1])) {
            message.channel.send("Please enter a valid amount of credits!");
            return;
        }
        const mentionEntry = message.mentions.users.values().next().value;
        if(mentionEntry === undefined) {
            message.channel.send("Please mention a user!");
            return;
        }
        const userID = mentionEntry.id;
        if(args[0] === "add") {
            args[1] = parseInt(args[1]);
            message.channel.send("Added " + args[1] + " credits to " + mentionEntry.username + "!");
            await CreditsHandler.incrementCreditsForUser(userID, args[1]);
            return;
        }
        else if(args[0] === "remove") {
            message.channel.send("Removed " + args[1] + " credits from" + mentionEntry.username + "!");
            args[1] = args[1] * -1;
            await CreditsHandler.incrementCreditsForUser(userID, args[1]);
            return;
        }
        else {
            message.channel.send("Set credits to " + args[1] + " for " + mentionEntry.username + "!");
            await CreditsHandler.setCreditsForUser(userID, args[1]);
            return;
        }
    }
};
