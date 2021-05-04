const CreditsHandler = require("../../scripts/creditshandler.js");
const LogChamp = require("../../scripts/logchamp.js");

module.exports = {
    name: "changecredits",
    description: "Change or set credits for a specific user",
    syntax: "changecredits <add/remove/set> <amount> <user mention>",
    min_args: 3,
    admin_only: true,
    async execute(message, args) {
        const mention = message.mentions.users.values().next().value;
        if(!checkForValidArgsAndNotifyUser(message, args, mention)) {
            return;
        }
        if(args[0] === "add") {
            addCreditsAndNotifyUser(message, args[1], mention);
            return;
        }
        else if(args[0] === "remove") {
            removeCreditsAndNotifyUser(message, args[1], mention);
            return;
        }
        else {
            setCreditsAndNotifyUser(message, args[1], mention);
            return;
        }
    }
};

function checkForValidArgsAndNotifyUser(message, args, mention) {
    if(args[0] !== "add" && args[0] !== "remove" && args[0] !== "set") {
        message.channel.send("Please use either \"add\", \"remove\" or \"set\" to change a user's credits!");
        return false;
    }
    if(isNaN(args[1])) {
        message.channel.send("Please enter a valid amount of credits!");
        return false;
    }
    if(mention === undefined) {
        message.channel.send("Please mention a user!");
        return false;
    }
    return true;
}

async function addCreditsAndNotifyUser(message, amount, mention) {
    amount = parseInt(amount);
    message.channel.send("Added " + amount + " credits to " + mention.username + "!");
    await CreditsHandler.incrementCreditsForUser(mention.id, amount);
}

async function removeCreditsAndNotifyUser(message, amount, mention) {
    message.channel.send("Removed " + amount + " credits from" + mention.username + "!");
    amount = amount * -1;
    await CreditsHandler.incrementCreditsForUser(mention.id, amount);
}

async function setCreditsAndNotifyUser(message, amount, mention) {
    message.channel.send("Set credits to " + amount + " for " + mention.username + "!");
    await CreditsHandler.setCreditsForUser(mention.id, amount);
}
