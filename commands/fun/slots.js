var rollCycles = 3;
var symbols = [":grapes:", ":cherries:", ":lemon:", ":tangerine:", ":apple:", ":blueberries:", ":kiwi:", ":strawberry:"];

module.exports = {
    name: "slots",
    description: "Simulates a slot machine, but without the monetary losses...and gains.",
    syntax: "slots",
    execute(message, args) {
        var slotMessagePromise = message.channel.send("Rolling").then(function(messageObject) {
            return messageObject;
        }
        );
        const waitForMessage = () => {
            slotMessagePromise.then((slotMessage) => {
                animateRollingMessage(slotMessage);
            });
        };
        waitForMessage();
        setTimeout(() => slotMessagePromise.then(function(slotMessage) {
            var randomSymbols = selectRandomSymbols();
            var coinsWon = calculateWin();
            finishAnimation(slotMessage, randomSymbols, coinsWon);
        }), rollCycles * 4000 + 1000);
    }
};

async function animateRollingMessage(slotMessage) {
    for(let i = 0; i < rollCycles; i++) {
        await sleep(1000);
        slotMessage.edit("Rolling.");
        await sleep(1000);
        slotMessage.edit("Rolling..");
        await sleep(1000);
        slotMessage.edit("Rolling...");
        await sleep(1000);
        slotMessage.edit("Rolling");
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

function calculateWin() {
    var winTier = Math.floor(Math.random() * 100) + 1;
    if(winTier <= 50) {
        return 0;
    }
    else if(winTier <= 75) {
        return Math.floor(Math.random() * 400) + 350;
    }
    else if(winTier <= 87) {
        return Math.floor(Math.random() * 750) + 750;
    }
    else if(winTier <= 96) {
        return Math.floor(Math.random() * 1500) + 1500;
    }
    else {
        return Math.floor(Math.random() * 3000) + 3000;
    }
}

function finishAnimation(slotMessage, randomSymbols, coinsWon) {
    var slotMachineBorder = " - - - - - - - - -\n";
    var finishedSlotText = "";
    if(coinsWon == 0) {
        finishedSlotText = "Unfortunately, you won nothing :frowning:\nBetter luck next time!\n" + slotMachineBorder;
    }
    else {
        finishedSlotText = "You've won " + coinsWon + " coins! Hooray!\n" + slotMachineBorder;
    }
    for(let i = 0; i <= 8; i = i + 3) {
        var slotMachineRow = "  " + randomSymbols[i] + " " + randomSymbols[i + 1] + " " + randomSymbols[i + 2] + "  \n";
        finishedSlotText = finishedSlotText + slotMachineRow;
    }
    finishedSlotText = finishedSlotText + slotMachineBorder;
    slotMessage.edit(finishedSlotText);
}
