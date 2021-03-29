var rollingMessage = "Rolling";
var doneMessage = "Done! You win ";
var slotMachineBorder = " - - - - - - - - -\n";
var slotMachineRow = "    X    X    X    \n";
var slotMachineText = "\n" + slotMachineBorder + slotMachineRow + slotMachineRow + slotMachineRow + slotMachineBorder;
var rollCycles = 2;
var symbols = [":grapes:", ":cherries:", ":lemon:", ":tangerine:", ":apple:", ":blueberries:", ":kiwi:", ":strawberry:"];

module.exports = {
    name: "slots",
    description: "Simulates a slot machine, but without the monetary losses...and gains.",
    syntax: "slots <bet amount>",
    execute(message, args) {
        var coinsWon = Math.floor(Math.random() * 2000);

        var slotMessagePromise = message.channel.send(rollingMessage + slotMachineText).then(function(message) {return message});
        const waitForMessage = () => {
            slotMessagePromise.then((slotMessage) => {
                animateRollingMessage(slotMessage);
            });
        };
        waitForMessage();
        setTimeout(() => slotMessagePromise.then(function(slotMessage) {
            finishAnimation(slotMessage, coinsWon);
        }), rollCycles * 4000 + 1000);
    }
};

async function animateRollingMessage(slotMessage) {
    for(let i = 0; i < rollCycles; i++) {
        await sleep(1000);
        slotMessage.edit(editLineInString(slotMessage.content, 0, rollingMessage + "."));
        await sleep(1000);
        slotMessage.edit(editLineInString(slotMessage.content, 0, rollingMessage + ".."));
        await sleep(1000);
        slotMessage.edit(editLineInString(slotMessage.content, 0, rollingMessage + "..."));
        await sleep(1000);
        slotMessage.edit(editLineInString(slotMessage.content, 0, rollingMessage));
    }
}

function finishAnimation(slotMessage, coinsWon) {
    for(let i = 0; i < 3; i++) {
        slotMachineText = slotMachineText.replace("X", i);
    }
    slotMessage.edit(editLineInString(slotMessage.content, 0, doneMessage + coinsWon + " coins!"));
}

function editLineInString(stringToEdit, lineIndex, newLineString) {
    var editedString = "";
    var lineArray = stringToEdit.split("\n");

    if(lineIndex >= lineArray.length) {
        console.error("lineIndex is too large!");
    }
    else {
        lineArray[lineIndex] = newLineString;
        for(let line of lineArray) {
            editedString = editedString + line + "\n";
        }
    }
    return editedString;
}

function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}
