import {Message} from "discord.js";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommand} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export interface MathOperation {
    mathQuestion: MathQuestion
    generateMathQuestion: () => MathQuestion
    getEquationString: () => string
    getResult: () => number
    getTimeForAnswering: () => number
}

export class PlusOperation implements MathOperation {
    //@ts-ignore
    mathQuestion: MathQuestion;

    generateMathQuestion() {
        var value = Math.floor(Math.random() * 100) + 1;
        var term = Math.floor(Math.random() * 50) + 1;
        var timeForAnswering = this.calculateTimeForAnswering(value, term);

        this.mathQuestion = {value: value, term: term, timeForAnswering: timeForAnswering};
        return this.mathQuestion;
    }

    private calculateTimeForAnswering(value: number, term: number): number {
        var timeForAnswering = 2000;

        if(value < 10 && term < 10) return 3000;
        else if(value < 10 || term < 10) return 4000;

        if(isNumberMultipleOf(value, 10)) timeForAnswering += 1000;
        else if(isNumberMultipleOf(value, 5)) timeForAnswering += 2000;
        else if(isNumberMultipleOf(value, 2)) timeForAnswering += 2000;
        else timeForAnswering += 3000;

        if(isNumberMultipleOf(term, 10)) timeForAnswering += 1000;
        else if(isNumberMultipleOf(value, 5)) timeForAnswering += 2000;
        else timeForAnswering += Math.ceil(term / 10) * 1000;

        if(value % 10 + term % 10 > 10) timeForAnswering += 2000;

        return timeForAnswering;
    }

    getEquationString() {
        return this.mathQuestion.value + " + " + this.mathQuestion.term;
    }

    getResult() {
        return this.mathQuestion.value + this.mathQuestion.term;
    }

    getTimeForAnswering() {
        return this.mathQuestion.timeForAnswering;
    }
}

export class MinusOperation implements MathOperation {
    //@ts-ignore
    mathQuestion: MathQuestionType;

    generateMathQuestion() {
        var value = Math.floor(Math.random() * 100) + 1;
        var term = Math.floor(Math.random() * 50) + 1;
        var timeForAnswering = this.calculateTimeForAnswering(value, term);

        this.mathQuestion = {value: value, term: term, timeForAnswering: timeForAnswering};
        return this.mathQuestion;
    }

    private calculateTimeForAnswering(value: number, term: number): number {
        var timeForAnswering = 4000;

        if(value < 10 && term < 10) return 4000;
        else if(value < 10 || term < 10) return 5000;
        else if(value - term < 10 && value - term > -10) return 5000;

        if(isNumberMultipleOf(value, 10)) timeForAnswering += 1000;
        else if(isNumberMultipleOf(value, 5)) timeForAnswering += 2000;
        else if(isNumberMultipleOf(value, 2)) timeForAnswering += 2000;
        else timeForAnswering += 3000;

        if(isNumberMultipleOf(term, 10)) timeForAnswering += 1000;
        else if(isNumberMultipleOf(value, 5)) timeForAnswering += 2000;
        else timeForAnswering += Math.ceil(term / 10) * 1000;

        if(value % 10 - term % 10 < 0) timeForAnswering += 2000;

        return timeForAnswering;
    }

    getEquationString() {
        return this.mathQuestion.value + " - " + this.mathQuestion.term;
    }

    getResult() {
        return this.mathQuestion.value - this.mathQuestion.term;
    }

    getTimeForAnswering() {
        return this.mathQuestion.timeForAnswering;
    }
}

export type MathQuestion = {
    value: number
    term: number
    timeForAnswering: number
}

export class MathCommand implements CreativeCommand {
    name = Localizer.translate("math.name");
    description = Localizer.translate("math.description");
    syntax = Localizer.translate("math.syntax");
    min_args = 0;
    admin_only = false;
    guild_only = false;

    operations: MathOperation[] = [
        new PlusOperation(),
        new MinusOperation()
    ];

    execute(message: Message, args: string[]): void {
        this.askMathQuestionAndProcessAnswer(message);
    }

    askMathQuestionAndProcessAnswer(message: Message): void {
        var randomOperationIndex = Math.floor(Math.random() * this.operations.length);
        var mathOperation = this.operations[randomOperationIndex];

        mathOperation.generateMathQuestion();
        var equation = mathOperation.getEquationString();
        let timeForAnsweringInSeconds = mathOperation.getTimeForAnswering() / 1000;

        message.channel.send(Localizer.translate("math.questionMessage", {equation: equation, timeForAnswering: timeForAnsweringInSeconds}));
        this.collectAndResolveAnswer(message, mathOperation);
    }

    collectAndResolveAnswer(message: Message, question: MathOperation): void {
        const filter = (filteredMessage: Message) => filteredMessage.author.id === message.author.id;
        const collector = message.channel.createMessageCollector(filter, {max: 1, time: question.getTimeForAnswering()});

        collector.on("collect", (collectedMessage: any) => {
            this.replyBasedOnValidityOfAnswer(collectedMessage, question);
        });
        collector.on("end", (collectedMessages: any) => {
            this.replyIfNoMessagesWereSent(message, question, collectedMessages);
        });
    }

    replyBasedOnValidityOfAnswer(message: Message, question: MathOperation): void {
        let timeForAnsweringInSeconds = question.getTimeForAnswering() / 1000;
        if(parseInt(message.content) == question.getResult()) {
            message.channel.send(Localizer.translate("math.correctAnswer", {amount: timeForAnsweringInSeconds}));
            CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), timeForAnsweringInSeconds);
        }
        else {
            message.channel.send(Localizer.translate("math.wrongAnswer", {result: question.getResult(), amount: timeForAnsweringInSeconds}));
            CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), timeForAnsweringInSeconds * -1);
        }
    }

    replyIfNoMessagesWereSent(message: Message, question: MathOperation, collectedMessages: any): void {
        let timeForAnsweringInSeconds = question.getTimeForAnswering() / 1000;
        if(collectedMessages.size == 0) {
            message.channel.send(Localizer.translate("math.noAnswer", {result: question.getResult(), amount: timeForAnsweringInSeconds * 2}));
            CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), timeForAnsweringInSeconds * -2);
        }
    }
}

export function isNumberMultipleOf(numberInQuestion: number, multiple: number): boolean {
    if(numberInQuestion % multiple === 0) return true;
    else return false;
}
