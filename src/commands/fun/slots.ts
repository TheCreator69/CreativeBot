import {Message} from "discord.js";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export class SlotsCommand implements CreativeCommand {
    name = Localizer.translate("slots.name");
    description = Localizer.translate("slots.description");
    syntax = Localizer.translate("slots.syntax");
    min_args = 1;
    admin_only = false;
    guild_only = false;

    rollCycles = 3;
    symbols = [":grapes:", ":cherries:", ":lemon:", ":green_apple:", ":kiwi:", ":peach:"];
    slotColumns = 3;
    slotRows = 3;

    async checkRequiredArgs(args: string[], message: Message | undefined): Promise<ArgsCheckResult> {
        var bet = parseInt(args[0]);
        if(isNaN(bet)) {
            return {valid: false, replyMessage: Localizer.translate("slots.arg0NaN")};
        }
        if(bet <= 0) {
            return {valid: false, replyMessage: Localizer.translate("slots.negativeBet")};
        }
        //@ts-ignore
        var creditsOfAuthor = await CreditsHandler.getCreditsForUser(message.author.id);
        if(bet > creditsOfAuthor) {
            return {valid: false, replyMessage: Localizer.translate("slots.tooLargeBet")};
        }
        return {valid: true};
    }

    async execute(message: Message, args: string[]): Promise<void> {
        var bet = parseInt(args[0]);
        await this.createAndEditMessageOverTime(message, bet);
    }

    async createAndEditMessageOverTime(message: Message, bet: number): Promise<void> {
        var slotMessage = await message.channel.send(Localizer.translate("slots.rolling"));
        this.animateRollingMessage(slotMessage);
        await this.finishAnimationAndAwardCoins(slotMessage, message, bet);
    }

    async animateRollingMessage(slotMessage: Message): Promise<void> {
        for(let i = 0; i < this.rollCycles; i++) {
            await this.sleep(1000);
            slotMessage.edit(Localizer.translate("slots.rolling") + ".");
            await this.sleep(1000);
            slotMessage.edit(Localizer.translate("slots.rolling") + "..");
            await this.sleep(1000);
            slotMessage.edit(Localizer.translate("slots.rolling") + "...");
            await this.sleep(1000);
            slotMessage.edit(Localizer.translate("slots.rolling"));
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
        for(let i = 0; i < this.slotRows * this.slotColumns; i++) {
            if(i % this.slotColumns == 0) {
                randomSymbols.push(this.symbols[Math.floor(Math.random() * this.symbols.length)]);
            }
            else {
                if(Math.random() < 0.25) {
                    var differenceBetweenIndexOfFirstSymbolOnRow = Math.floor(i % this.slotColumns);
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
        for(let rowStartIndex = 0; rowStartIndex < this.slotRows * this.slotColumns; rowStartIndex += this.slotColumns) {

            for(let rowColumnIndex = 0; rowColumnIndex < this.slotColumns; rowColumnIndex++) {
                if(randomSymbols[rowStartIndex] !== randomSymbols[rowStartIndex + rowColumnIndex]) {
                    break;
                }
                if(rowColumnIndex === this.slotColumns - 1) numberOfHorizontalRows++;
            }

        }
        return numberOfHorizontalRows;
    }

    getDiagonalRowCount(randomSymbols: string[]): number {
        var numberOfDiagonalRows = 0;
        //Check lines from top left to bottom right along top row
        for(let i = 0; i < this.slotColumns - 2; i++) {

            for(let j = 1; j < this.slotRows; j++) {
                if(randomSymbols[i] !== randomSymbols[j * this.slotColumns + j]) {
                    break;
                }
                if(j === this.slotRows - 1) numberOfDiagonalRows++;
            }

        }
        //Check lines from top right to bottom left along top row
        for(let i = this.slotColumns - 1; i > 1; i--) {

            for(let j = 1; j < this.slotRows; j++) {
                if(randomSymbols[i] !== randomSymbols[j * this.slotColumns + (this.slotColumns - 1 - j)]) {
                    break;
                }
                if(j === this.slotRows - 1) numberOfDiagonalRows++;
            }

        }
        return numberOfDiagonalRows;
    }

    finishEditingMessage(slotMessage: Message, randomSymbols: string[], creditsWon: number): void {
        var slotMachineBorder = " - - - - - - - - -\n";
        var finishedSlotMessage = "";
        if(creditsWon == 0) {
            finishedSlotMessage += Localizer.translate("slots.lostBet") + slotMachineBorder;
        }
        else {
            finishedSlotMessage += "You've won " + creditsWon + " Creative Credits! Hooray!\n" + slotMachineBorder;
        }
        for(let i = 0; i < this.slotRows * this.slotColumns; i += 3) {
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
