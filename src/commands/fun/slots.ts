import {Message} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export class SlotsCommand implements CreativeCommand {
    name = Localizer.translate("slots.name");
    description = Localizer.translate("slots.description");
    syntax = Localizer.translate("slots.syntax");
    min_args = 1;
    admin_only = false;
    guild_only = false;

    rollCycles = 2;
    symbols = [":grapes:", ":cherries:", ":lemon:", ":green_apple:", ":kiwi:", ":peach:"];
    slotColumns = 3;
    slotRows = 3;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        var bet = parseInt(args[0]);
        if(isNaN(bet)) {
            return {valid: false, replyMessage: Localizer.translate("slots.arg0NaN")};
        }
        if(bet <= 0) {
            return {valid: false, replyMessage: Localizer.translate("slots.negativeBet")};
        }
        if(bet > 2147483647) {
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
        await this.finishAnimationAndAwardCoins(slotMessage, bet);
    }

    async animateRollingMessage(slotMessage: Message): Promise<void> {
        for(let i = 0; i < this.rollCycles; i++) {
            await this.sleep(1500);
            slotMessage.edit(Localizer.translate("slots.rolling"));
            await this.sleep(1500);
            slotMessage.edit(Localizer.translate("slots.rolling") + ".");
            await this.sleep(1500);
            slotMessage.edit(Localizer.translate("slots.rolling") + "..");
            await this.sleep(1500);
            slotMessage.edit(Localizer.translate("slots.rolling") + "...");
        }
    }

    sleep(delay: number): Promise<unknown> {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    async finishAnimationAndAwardCoins(slotMessage: Message, bet: number): Promise<void> {
        setTimeout(() => {
            var randomSymbols = this.selectSeeminglyRandomSymbols();
            var horizontalLines = this.getHorizontalLineCount(randomSymbols);
            var diagonalLines = this.getDiagonalLineCount(randomSymbols);
            var verticalLines = this.getVerticalLineCount(randomSymbols);
            var creditsWon = this.determineCreditsWon(horizontalLines, diagonalLines, verticalLines, bet);
            this.finishEditingMessage(slotMessage, randomSymbols, creditsWon);
        }, this.rollCycles * 6000 + 1000);
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

    getHorizontalLineCount(symbols: string[]): number {
        var numberOfHorizontalLines = 0;
        for(let i = 0; i < this.slotRows * this.slotColumns; i += 3) {
            if(symbols[i] === symbols[i + 1] && symbols[i] === symbols[i + 2]) numberOfHorizontalLines++;
        }
        return numberOfHorizontalLines;
    }

    getDiagonalLineCount(symbols: string[]): number {
        var numberOfDiagonalLines = 0;
        if(symbols[0] === symbols[4] && symbols[0] === symbols[8]) numberOfDiagonalLines++;
        if(symbols[2] === symbols[4] && symbols[2] === symbols[6]) numberOfDiagonalLines++;
        return numberOfDiagonalLines;
    }

    getVerticalLineCount(symbols: string[]): number {
        var numberOfVerticalLines = 0;
        for(let i = 0; i < this.slotColumns; i++) {
            if(symbols[i] === symbols[i + 3] && symbols[i] === symbols[i + 6]) numberOfVerticalLines++;
        }
        return numberOfVerticalLines;
    }

    determineCreditsWon(horizontalLines: number, diagonalLines: number, verticalLines: number, bet: number): number {
        var betMultiplier = horizontalLines * 2 + diagonalLines * 4 + verticalLines * 2;
        return bet * betMultiplier;
    }

    finishEditingMessage(slotMessage: Message, randomSymbols: string[], creditsWon: number): void {
        var slotMachineBorder = " - - - - - - - - -\n";
        var finishedSlotMessage = "";
        if(creditsWon == 0) {
            finishedSlotMessage += Localizer.translate("slots.lostBet") + slotMachineBorder;
        }
        else {
            finishedSlotMessage += Localizer.translate("slots.wonBet", {amount: creditsWon}) + slotMachineBorder;
        }
        for(let i = 0; i < this.slotRows * this.slotColumns; i += 3) {
            var slotMachineRow = "  " + randomSymbols[i] + " " + randomSymbols[i + 1] + " " + randomSymbols[i + 2] + "  \n";
            finishedSlotMessage += slotMachineRow;
        }
        finishedSlotMessage += slotMachineBorder;
        slotMessage.edit(finishedSlotMessage);
    }

}
