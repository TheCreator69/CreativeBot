import {Message} from "discord.js";

var rollCycles = 3;
var symbols = [":grapes:", ":cherries:", ":lemon:", ":tangerine:", ":apple:", ":blueberries:", ":kiwi:", ":strawberry:"];

module.exports = {
    name: "slots",
    description: "Simulates a slot machine, but without the monetary losses...and gains.",
    syntax: "slots",
    min_args: 0,
    admin_only: false,
    async execute(message: Message, args: string[]) {
        await editMessageOverTime(message);
    }
};

async function editMessageOverTime(message: Message): Promise<void> {
    var slotMessage = await message.channel.send("Rolling");
    animateMessageWhenReady(slotMessage);
    finishAnimation(slotMessage);
}

async function animateMessageWhenReady(slotMessage: Message): Promise<void> {
    animateRollingMessage(slotMessage);
}

async function animateRollingMessage(slotMessage: Message): Promise<void> {
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

function sleep(delay: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

function finishAnimation(slotMessage: Message): void {
    setTimeout(() => {
        var randomSymbols = selectRandomSymbols();
        var coinsWon = calculateWin();
        finishEditingMessage(slotMessage, randomSymbols, coinsWon);
    }, rollCycles * 4000 + 1000);
}

function selectRandomSymbols(): string[] {
    var randomSymbols: string[] = [];
    for(let i = 0; i < 9; i++) {
        randomSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }
    return randomSymbols;
}

function calculateWin(): number {
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

function finishEditingMessage(slotMessage: Message, randomSymbols: string[], coinsWon: number): void {
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
