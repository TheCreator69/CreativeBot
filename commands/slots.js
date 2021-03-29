var rollingMessage = "Rolling";
var doneMessage = "Done! You win ";
var rollCycles = 3;
var symbols = [":grapes:", ":cherries:", ":lemon:", ":tangerine:", ":apple:", ":blueberries:", ":kiwi:", ":strawberry:"];

module.exports = {
    name: "slots",
    description: "Simulates a slot machine, but without the monetary losses...and gains.",
    syntax: "slots <bet amount>",
    execute(message, args) {
        var slotMessagePromise = message.channel.send(rollingMessage).then(function(message) {return message});
        const waitForMessage = () => {
            slotMessagePromise.then((slotMessage) => {
                //animateRollingMessage(slotMessage);
            });
        };
        waitForMessage();
        setTimeout(() => slotMessagePromise.then(function(slotMessage) {
            var randomSymbols = selectRandomSymbols();
            var coinsWon = calculateWin(randomSymbols);
            finishAnimation(slotMessage, randomSymbols, coinsWon);
        }), 0); //rollCycles * 4000 + 1000
    }
};

async function animateRollingMessage(slotMessage) {
    for(let i = 0; i < rollCycles; i++) {
        await sleep(1000);
        slotMessage.edit(rollingMessage + ".");
        await sleep(1000);
        slotMessage.edit(rollingMessage + "..");
        await sleep(1000);
        slotMessage.edit(rollingMessage + "...");
        await sleep(1000);
        slotMessage.edit(rollingMessage);
    }
}

function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function selectRandomSymbols() {
    var randomSymbols = [];
    for(let i = 0; i < 9; i++) {
        randomSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return randomSymbols;
}

function calculateWin(randomSymbols) {
    return Math.floor(Math.random() * 2000);
}

function finishAnimation(slotMessage, randomSymbols, coinsWon) {
    var slotMachineBorder = " - - - - - - - - -\n";
    var finishedSlotText = doneMessage + coinsWon + " coins!\n" + slotMachineBorder;
    for(let i = 0; i <= 8; i = i + 3) {
        var slotMachineRow = "  " + randomSymbols[i] + " " + randomSymbols[i+1] + " " + randomSymbols[i + 2] + "  \n";
        finishedSlotText = finishedSlotText + slotMachineRow;
    }
    finishedSlotText = finishedSlotText + slotMachineBorder;
    slotMessage.edit(finishedSlotText);
}
