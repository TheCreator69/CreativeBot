import {Message} from "discord.js";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export class MathQuestion {
    initialValue: number;
    isPlusOperator: boolean;
    term: number;
    timeForAnswering: number;
    result: number;

    constructor(_initialValue: number, _isPlusOperator: boolean, _term: number, _timeForAnswering: number) {
        this.initialValue = _initialValue;
        this.isPlusOperator = _isPlusOperator;
        this.term = _term;
        this.timeForAnswering = _timeForAnswering;
        if(this.isPlusOperator) this.result = this.initialValue + this.term;
        else this.result = this.initialValue - this.term;
    }
}

export class MathCommand implements CreativeCommand {
    name = Localizer.translate("math.name");
    description = Localizer.translate("math.description");
    syntax = Localizer.translate("math.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    execute(message: Message, args: string[]): void {
        this.askMathQuestionAndProcessAnswer(message);
    }

    askMathQuestionAndProcessAnswer(message: Message): void {
        var mathQuestion = this.generateMathQuestion();
        message.channel.send(this.createQuestionMessage(mathQuestion));
        this.collectAndResolveAnswer(message, mathQuestion);
    }

    generateMathQuestion(): MathQuestion {
        var initialValue = Math.floor(Math.random() * 100) + 1;
        var isPlusOperator = Math.random() < 0.5;
        var term = Math.floor(Math.random() * 50) + 1;
        var timeForAnswering = this.calculateTimeForAnswering(initialValue, isPlusOperator, term);

        return new MathQuestion(initialValue, isPlusOperator, term, timeForAnswering);
    }

    calculateTimeForAnswering(initialValue: number, isPlusOperator: boolean, term: number): number {
        var answerTime = 0;

        if(this.isNumberMultipleOf(initialValue, 10)) answerTime += 1000;
        else if(this.isNumberMultipleOf(initialValue, 2)) answerTime += 2000;
        else answerTime += 3000;

        if(this.isNumberMultipleOf(term, 10)) answerTime += 1000;
        else answerTime += Math.ceil(term / 10) * 1000;

        if(isPlusOperator) answerTime += 2000;
        else answerTime += 4000;

        return answerTime;
    }

    isNumberMultipleOf(numberInQuestion: number, multiple: number): boolean {
        if(numberInQuestion % multiple === 0) return true;
        else return false;
    }

    createQuestionMessage(question: MathQuestion): string {
        var mathOperator;
        if(question.isPlusOperator) mathOperator = "+";
        else mathOperator = "-";
        return Localizer.translate("math.questionMessage", {initialValue: question.initialValue, mathOperator: mathOperator, term: question.term, timeForAnswering: question.timeForAnswering / 1000});
    }

    collectAndResolveAnswer(message: Message, question: MathQuestion): void {
        const filter = (filteredMessage: Message) => filteredMessage.author.id === message.author.id;
        const AMOUNT_OF_MESSAGES_TO_COLLECT: number = 1;
        const collector = message.channel.createMessageCollector(filter, {max: AMOUNT_OF_MESSAGES_TO_COLLECT, time: question.timeForAnswering});

        collector.on("collect", (collectedMessage: any) => {
            this.replyBasedOnValidityOfAnswer(collectedMessage, question);
        });
        collector.on("end", (collectedMessages: any) => {
            this.replyIfNoMessagesWereSent(message, question, collectedMessages);
        });
    }

    replyBasedOnValidityOfAnswer(message: Message, question: MathQuestion): void {
        if(parseInt(message.content) == question.result) {
            message.channel.send(Localizer.translate("math.correctAnswer", {amount: question.timeForAnswering / 1000}));
            CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), question.timeForAnswering / 1000);
        }
        else {
            message.channel.send(Localizer.translate("math.wrongAnswer", {result: question.result, amount: question.timeForAnswering / 1000}));
            CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), question.timeForAnswering / 1000 * -1);
        }
    }

    replyIfNoMessagesWereSent(message: Message, question: MathQuestion, collectedMessages: any): void {
        if(collectedMessages.size == 0) {
            message.channel.send(Localizer.translate("math.noAnswer", {result: question.result, amount: question.timeForAnswering / 1000 * 2}));
            CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), question.timeForAnswering / 1000 * -2);
        }
    }

}
