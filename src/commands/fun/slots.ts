import {Message} from "discord.js";
import * as CreditsHandler from "../../scripts/creditshandler";

var rollCycles = 0;
var symbols = [":grapes:", ":cherries:", ":lemon:", ":green_apple:", ":kiwi:", ":peach:"];

module.exports = {
    name: "slots",
    description: "Simulates a slot machine, but without the monetary losses...and gains. You win if there are horizontal or diagonal lines of matching symbols.",
    syntax: "slots <bet>",
    min_args: 1,
    admin_only: false,
    async execute(message: Message, args: string[]) {
        await editMessageIfBetIsValid(message, args);
    }
};

async function editMessageIfBetIsValid(message: Message, args: string[]): Promise<void> {
    var bet = parseInt(args[0]);
    if(isNaN(bet)) {
        message.channel.send("Please enter a number as a bet!");
        return;
    }
    if(bet <= 0) {
        message.channel.send("Nice try, but I thought of that. Please enter a bet above 0.");
        return;
    }
    var creditsOfAuthor = await CreditsHandler.getCreditsForUser(BigInt(message.author.id));
    if(bet > creditsOfAuthor) {
        message.channel.send("Your bet exceeds the amount of Creative Credits you have!");
        return;
    }
    createAndEditMessageOverTime(message, bet);
}

async function createAndEditMessageOverTime(message: Message, bet: number): Promise<void> {
    var slotMessage = await message.channel.send("Rolling");
    animateRollingMessage(slotMessage);
    await finishAnimationAndAwardCoins(slotMessage, message, bet);
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

async function finishAnimationAndAwardCoins(slotMessage: Message, message: Message, bet: number): Promise<void> {
    setTimeout(() => {
        var randomSymbols = selectSeeminglyRandomSymbols();
        var creditsWon = determineCreditsWon(randomSymbols, bet);
        finishEditingMessage(slotMessage, randomSymbols, creditsWon);
        withdrawOrAwardCredits(message, creditsWon, bet);
    }, rollCycles * 4000 + 1000);
}

function selectSeeminglyRandomSymbols(): string[] {
    var randomSymbols: string[] = [];
    for(let i = 0; i < 9; i++) { //Hard-coded stuff. Always a good idea.
        if(i === 0 || i === 3 || i === 6) {
            randomSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
        else {
            if(Math.random() < 0.25) {
                var differenceBetweenIndexOfFirstSymbolOnRow = Math.floor(i % 3); //Probably the best variable name in existance
                randomSymbols.push(randomSymbols[i - differenceBetweenIndexOfFirstSymbolOnRow]);
            }
            else {
                randomSymbols.push(symbols[Math.floor(Math.random() * symbols.length)]);
            }
        }
    }
    return randomSymbols;
}

function determineCreditsWon(randomSymbols: string[], bet: number): number {
    var betMultiplier = getHorizontalRowCount(randomSymbols) * 2 + getDiagonalRowCount(randomSymbols) * 4;
    return bet * betMultiplier;
}

function getHorizontalRowCount(randomSymbols: string[]): number {
    var numberOfHorizontalRows = 0;
    for(let i = 0; i <= 8; i += 3) {
        if(randomSymbols[i] === randomSymbols[i + 1] && randomSymbols[i] === randomSymbols[i + 2]) {
            numberOfHorizontalRows++;
        }
    }
    return numberOfHorizontalRows;
}

function getDiagonalRowCount(randomSymbols: string[]): number {
    var numberOfDiagonalRows = 0;
    if(randomSymbols[0] === randomSymbols[4] && randomSymbols[0] === randomSymbols[8]) {
        numberOfDiagonalRows++;
    }
    if(randomSymbols[6] === randomSymbols[4] && randomSymbols[6] === randomSymbols[2]) {
        numberOfDiagonalRows++;
    }
    return numberOfDiagonalRows;
}

function finishEditingMessage(slotMessage: Message, randomSymbols: string[], creditsWon: number): void {
    var slotMachineBorder = " - - - - - - - - -\n";
    var finishedSlotMessage = "";
    if(creditsWon == 0) {
        finishedSlotMessage += "Unfortunately, you lost your bet :frowning:\nBetter luck next time!\n" + slotMachineBorder;
    }
    else {
        finishedSlotMessage += "You've won " + creditsWon + " Creative Credits! Hooray!\n" + slotMachineBorder;
    }
    for(let i = 0; i <= 8; i += 3) {
        var slotMachineRow = "  " + randomSymbols[i] + " " + randomSymbols[i + 1] + " " + randomSymbols[i + 2] + "  \n";
        finishedSlotMessage += slotMachineRow;
    }
    finishedSlotMessage += slotMachineBorder;
    slotMessage.edit(finishedSlotMessage);
}

async function withdrawOrAwardCredits(message: Message, creditsWon: number, bet: number): Promise<void> {
    if(creditsWon === 0) {
        await CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), -bet);
        return;
    }
    await CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), creditsWon - bet);
}
