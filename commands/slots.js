var rollingMessage = "Rolling";
var doneMessage = "Done! You win ";
var slotMachineText = "\n - - - - - - - - -\n|                      |\n|   X    X    X   |\n|                      |\n - - - - - - - - -";
var rollTimeMS = 13000;

module.exports = {
    name: "slots",
    description: "Simulates a slot machine, but without the monetary losses...and gains.",
    syntax: "slots",
    execute(message, args) {
        var coinsWon = Math.floor(Math.random() * 2000);

        sentMessagePromise = message.channel.send(rollingMessage + slotMachineText);
        animateRollingMessage(sentMessagePromise);
        setTimeout(() => sentMessagePromise.then(function(message) {
            for(let i = 0; i < 3; i++) {
                slotMachineText = slotMachineText.replace("X", i);
            }
            message.edit(doneMessage + coinsWon + " coins!" + slotMachineText)
        }), rollTimeMS);
    }
};

async function animateRollingMessage(sentMessagePromise) {
    for(let i = 0; i < 3; i++) {
        await sleep(1000);
        sentMessagePromise.then(function(message) {message.edit(rollingMessage + "." + slotMachineText)});
        await sleep(1000);
        sentMessagePromise.then(function(message) {message.edit(rollingMessage + ".." + slotMachineText)});
        await sleep(1000);
        sentMessagePromise.then(function(message) {message.edit(rollingMessage + "..." + slotMachineText)});
        await sleep(1000);
        sentMessagePromise.then(function(message) {message.edit(rollingMessage + slotMachineText)});
    }
}

function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}
