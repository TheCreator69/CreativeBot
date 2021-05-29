import {Message} from "discord.js";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand} from "../../scripts/commanddef";

export class Command implements CreativeCommand {
    name = "slots";
    description = "Simulates a slot machine, but without the monetary losses...and gains. You win if there are horizontal or diagonal lines of matching symbols";
    syntax = "slots <bet>";
    min_args = 1;
    admin_only = false;

    rollCycles = 3;
    symbols = [":grapes:", ":cherries:", ":lemon:", ":green_apple:", ":kiwi:", ":peach:"];

    async checkRequiredArgs(message: Message, args: string[]): Promise<boolean> {
        var bet = parseInt(args[0]);
        if(isNaN(bet)) {
            message.channel.send("Please enter a number as a bet!");
            return false;
        }
        if(bet <= 0) {
            message.channel.send("Nice try, but I thought of that. Please enter a bet above 0.");
            return false;
        }
        var creditsOfAuthor = await CreditsHandler.getCreditsForUser(BigInt(message.author.id));
        if(bet > creditsOfAuthor) {
            message.channel.send("Your bet exceeds the amount of Creative Credits you have!");
            return false;
        }
        return true;
    }

    async execute(message: Message, args: string[]): Promise<void> {
        var bet = parseInt(args[0]);
        await this.createAndEditMessageOverTime(message, bet);
    }

    async createAndEditMessageOverTime(message: Message, bet: number): Promise<void> {
        var slotMessage = await message.channel.send("Rolling");
        this.animateRollingMessage(slotMessage);
        await this.finishAnimationAndAwardCoins(slotMessage, message, bet);
    }

    async animateRollingMessage(slotMessage: Message): Promise<void> {
        for(let i = 0; i < this.rollCycles; i++) {
            await this.sleep(1000);
            slotMessage.edit("Rolling.");
            await this.sleep(1000);
            slotMessage.edit("Rolling..");
            await this.sleep(1000);
            slotMessage.edit("Rolling...");
            await this.sleep(1000);
            slotMessage.edit("Rolling");
        }
    }

    sleep(delay: number): Promise<unknown> {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    async finishAnimationAndAwardCoins(slotMessage: Message, message: Message, bet: number): Promise<void> {
        setTimeout(() => {
            var randomSymbols = this.selectSeeminglyRandomSymbols();
            var horizontalRows = this.getHorizontalRowCount(randomSymbols);
            var diagonalRows = this.getDiagonalRowCount(randomSymbols);
            var creditsWon = this.determineCreditsWon(horizontalRows, diagonalRows, bet);
            this.finishEditingMessage(slotMessage, randomSymbols, creditsWon);
            this.withdrawOrAwardCredits(message, creditsWon, bet);
        }, this.rollCycles * 4000 + 1000);
    }

    selectSeeminglyRandomSymbols(): string[] {
        var randomSymbols: string[] = [];
        for(let i = 0; i < 9; i++) { //Hard-coded stuff. Always a good idea.
            if(i === 0 || i === 3 || i === 6) {
                randomSymbols.push(this.symbols[Math.floor(Math.random() * this.symbols.length)]);
            }
            else {
                if(Math.random() < 0.25) {
                    var differenceBetweenIndexOfFirstSymbolOnRow = Math.floor(i % 3); //Probably the best variable name in existance
                    randomSymbols.push(randomSymbols[i - differenceBetweenIndexOfFirstSymbolOnRow]);
                }
                else {
                    randomSymbols.push(this.symbols[Math.floor(Math.random() * this.symbols.length)]);
                }
            }
        }
        return randomSymbols;
    }

    determineCreditsWon(horizontalRows: number, diagonalRows: number, bet: number): number {
        var betMultiplier = horizontalRows * 2 + diagonalRows * 4;
        return bet * betMultiplier;
    }

    getHorizontalRowCount(randomSymbols: string[]): number {
        var numberOfHorizontalRows = 0;
        for(let i = 0; i <= 8; i += 3) {
            if(randomSymbols[i] === randomSymbols[i + 1] && randomSymbols[i] === randomSymbols[i + 2]) {
                numberOfHorizontalRows++;
            }
        }
        return numberOfHorizontalRows;
    }

    getDiagonalRowCount(randomSymbols: string[]): number {
        var numberOfDiagonalRows = 0;
        if(randomSymbols[0] === randomSymbols[4] && randomSymbols[0] === randomSymbols[8]) {
            numberOfDiagonalRows++;
        }
        if(randomSymbols[6] === randomSymbols[4] && randomSymbols[6] === randomSymbols[2]) {
            numberOfDiagonalRows++;
        }
        return numberOfDiagonalRows;
    }

    finishEditingMessage(slotMessage: Message, randomSymbols: string[], creditsWon: number): void {
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

    async withdrawOrAwardCredits(message: Message, creditsWon: number, bet: number): Promise<void> {
        if(creditsWon === 0) {
            await CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), -bet);
            return;
        }
        await CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), creditsWon - bet);
    }

}
