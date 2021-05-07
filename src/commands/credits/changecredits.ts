import * as CreditsHandler from "../../scripts/creditshandler";

module.exports = {
    name: "changecredits",
    description: "Change or set credits for a specific user",
    syntax: "changecredits <add/remove/set> <amount> <user mention>",
    min_args: 3,
    admin_only: true,
    async execute(message: any, args: string[]) {
        const mention = message.mentions.users.values().next().value;
        if(!checkForValidArgsAndNotifyUser(message, args, mention)) {
            return;
        }
        var amount = parseInt(args[1]);
        if(args[0] === "add") {
            addCreditsAndNotifyUser(message, amount, mention);
            return;
        }
        else if(args[0] === "remove") {
            removeCreditsAndNotifyUser(message, amount, mention);
            return;
        }
        else {
            setCreditsAndNotifyUser(message, amount, mention);
            return;
        }
    }
};

function checkForValidArgsAndNotifyUser(message: any, args: string[], mention: any) {
    if(args[0] !== "add" && args[0] !== "remove" && args[0] !== "set") {
        message.channel.send("Please use either \"add\", \"remove\" or \"set\" to change a user's credits!");
        return false;
    }
    var amount = parseInt(args[1]);
    if(isNaN(amount)) {
        message.channel.send("Please enter a valid amount of credits!");
        return false;
    }
    if(mention === undefined) {
        message.channel.send("Please mention a user!");
        return false;
    }
    return true;
}

async function addCreditsAndNotifyUser(message: any, amount: number, mention: any) {
    message.channel.send("Added " + amount + " credits to " + mention.username + "!");
    await CreditsHandler.incrementCreditsForUser(mention.id, amount);
}

async function removeCreditsAndNotifyUser(message: any, amount: number, mention: any) {
    message.channel.send("Removed " + amount + " credits from" + mention.username + "!");
    var amountToRemove = amount * -1 as number;
    await CreditsHandler.incrementCreditsForUser(mention.id, amountToRemove);
}

async function setCreditsAndNotifyUser(message: any, amount: number, mention: any) {
    message.channel.send("Set credits to " + amount + " for " + mention.username + "!");
    await CreditsHandler.setCreditsForUser(mention.id, amount);
}
