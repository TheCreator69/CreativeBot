import {Message} from "discord.js";
import {CreativeCommand} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";
import {LogChamp, Category} from "../../scripts/logchamp";

var logChampInst = new LogChamp(Category.BotMessage);

export interface MathOperation {
    mathQuestion: MathQuestion
    generateMathQuestion: () => MathQuestion
    getEquation: () => string
    getResult: () => number
}

export class Addition implements MathOperation {
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
        if(value < 10 && term < 10) return 3000;
        else if(value < 10 || term < 10) return 4000;

        var timeForAnswering = 2000;

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

    getEquation() {
        return this.mathQuestion.value + " + " + this.mathQuestion.term;
    }

    getResult() {
        return this.mathQuestion.value + this.mathQuestion.term;
    }
}

export class Subtraction implements MathOperation {
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
        if(value < 10 && term < 10) return 4000;
        else if(value < 10 || term < 10) return 5000;
        else if(value - term < 10 && value - term > -10) return 5000;

        var timeForAnswering = 4000;

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

    getEquation() {
        return this.mathQuestion.value + " - " + this.mathQuestion.term;
    }

    getResult() {
        return this.mathQuestion.value - this.mathQuestion.term;
    }
}

export class Multiplication implements MathOperation {
    //@ts-ignore
    mathQuestion: MathQuestion;

    generateMathQuestion() {
        var value = Math.floor(Math.random() * 14) + 2;
        var term = Math.floor(Math.random() * 14) + 2;
        var timeForAnswering = this.calculateTimeForAnswering(value, term);

        this.mathQuestion = {value: value, term: term, timeForAnswering: timeForAnswering};
        return this.mathQuestion;
    }

    private calculateTimeForAnswering(value: number, term: number): number {
        if(value === 10 && term === 10) return 3000;
        if(value === 10 || term === 10) return 4000;
        if(value === 5) return 4000 + (Math.floor(term / 3) * 1000);
        if(term === 5) return 4000 + (Math.floor(value / 3) * 1000);
        if(value < 5 && term < 5) return 5000;
        if(value < 5 || term < 5) return 7000;
        if(value === term) return 5000 + (Math.floor(value / 3) * 1000);

        var timeForAnswering = 5000;

        if(value > term) timeForAnswering += 3000;
        else timeForAnswering += 5000;

        if((value === 9 || value === 11) || (term === 9 || term === 11)) timeForAnswering -= 2000;

        return timeForAnswering;
    }

    getEquation() {
        return this.mathQuestion.value + " * " + this.mathQuestion.term;
    }

    getResult() {
        return this.mathQuestion.value * this.mathQuestion.term;
    }
}

export class Division implements MathOperation {
    //@ts-ignore
    mathQuestion: MathQuestion;

    generateMathQuestion() {
        var term = Math.floor(Math.random() * 9) + 2;
        var value = 1;
        while(value % term !== 0 && value !== term) {
            value = Math.floor(Math.random() * 98) + 3;
        }
        var timeForAnswering = this.calculateTimeForAnswering(value, term);

        this.mathQuestion = {value: value, term: term, timeForAnswering: timeForAnswering};
        return this.mathQuestion;
    }

    private calculateTimeForAnswering(value: number, term: number): number {
        if(term === 10) return 4000;
        if(value < 10) return 6000;

        var timeForAnswering = 6000;

        if(term === 5) timeForAnswering += 1000
        else timeForAnswering += Math.floor(term / 2) * 1000;

        return timeForAnswering;
    }

    getEquation() {
        return this.mathQuestion.value + " / " + this.mathQuestion.term;
    }

    getResult() {
        return this.mathQuestion.value / this.mathQuestion.term;
    }
}

export class Modulo implements MathOperation {
    //@ts-ignore
    mathQuestion: MathQuestion;

    generateMathQuestion() {
        var term = Math.floor(Math.random() * 9) + 2;
        var value = 1;
        while(value < term) {
            value = Math.floor(Math.random() * 19) + 2;
        }
        var timeForAnswering = this.calculateTimeForAnswering(value, term);

        this.mathQuestion = {value: value, term: term, timeForAnswering: timeForAnswering};
        return this.mathQuestion;
    }

    private calculateTimeForAnswering(value: number, term: number): number {
        var timeForAnswering = 6000;

        if(value / term < 2) timeForAnswering += 2000;
        else timeForAnswering += Math.floor(value / term) * 1000;

        return timeForAnswering;
    }

    getEquation() {
        return this.mathQuestion.value + " % " + this.mathQuestion.term;
    }

    getResult() {
        return this.mathQuestion.value % this.mathQuestion.term;
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
    minArgs = 0;
    adminOnly = false;
    guildOnly = false;

    operations: MathOperation[] = [
        new Addition(),
        new Subtraction(),
        new Multiplication(),
        new Division(),
        new Modulo()
    ];

    execute(message: Message, args: string[]): void {
        this.askMathQuestionAndProcessAnswer(message);
    }

    askMathQuestionAndProcessAnswer(message: Message): void {
        var randomOperationIndex = Math.floor(Math.random() * this.operations.length);
        var mathOperation = this.operations[randomOperationIndex];

        mathOperation.generateMathQuestion();
        var equation = mathOperation.getEquation();
        let timeForAnsweringInSeconds = mathOperation.mathQuestion.timeForAnswering / 1000;
        logChampInst.debug("Generated math exercise", {equation: equation, answerTime: timeForAnsweringInSeconds});

        if(mathOperation instanceof Modulo) {
            message.channel.send(Localizer.translate("math.questionMessageModulo", {equation: equation, timeForAnswering: timeForAnsweringInSeconds}));
        }
        else {
            message.channel.send(Localizer.translate("math.questionMessage", {equation: equation, timeForAnswering: timeForAnsweringInSeconds}));
        }
        this.collectAndResolveAnswer(message, mathOperation);
    }

    collectAndResolveAnswer(message: Message, operation: MathOperation): void {
        const filter = (filteredMessage: Message) => {
            var messageAsNumber = parseInt(filteredMessage.content);
            if(filteredMessage.author.id === message.author.id && !isNaN(messageAsNumber)) return true;
            else return false;
        }
        const collector = message.channel.createMessageCollector(filter, {max: 1, time: operation.mathQuestion.timeForAnswering});

        collector.on("collect", (collectedMessage: Message) => {
            this.replyBasedOnValidityOfAnswer(collectedMessage, operation);
            logChampInst.debug("Collected answer from user", {message: collectedMessage.content});
        });
        collector.on("end", (collectedMessages: any) => {
            this.replyIfNoMessagesWereSent(message, operation, collectedMessages);
            logChampInst.debug("No answer from user was collected");
        });
    }

    replyBasedOnValidityOfAnswer(message: Message, operation: MathOperation): void {
        if(parseInt(message.content) == operation.getResult()) {
            message.channel.send(Localizer.translate("math.correctAnswer"));
        }
        else {
            message.channel.send(Localizer.translate("math.wrongAnswer", {result: operation.getResult()}));
        }
    }

    replyIfNoMessagesWereSent(message: Message, operation: MathOperation, collectedMessages: any): void {
        if(collectedMessages.size == 0) {
            message.channel.send(Localizer.translate("math.noAnswer", {result: operation.getResult()}));
        }
    }
}

export function isNumberMultipleOf(numberInQuestion: number, multiple: number): boolean {
    if(numberInQuestion % multiple === 0) return true;
    else return false;
}
