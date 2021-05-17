import {Message} from "discord.js";
import * as CreditsHandler from "../../scripts/creditshandler";
import {CreativeCommandAttributes} from "../../scripts/commanddef";

export var info: CreativeCommandAttributes = {
    name: "math",
    description: "Tests your math skills and quick thinking with an exercise that needs to be solved in a few seconds.",
    syntax: "math",
    min_args: 0,
    admin_only: false,
}

export function execute(message: Message, args: string[]): void {
    askMathQuestionAndProcessAnswer(message);
}

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

function askMathQuestionAndProcessAnswer(message: Message): void {
    var mathQuestion = generateMathQuestion();
    message.channel.send(createQuestionMessage(mathQuestion));
    collectAndResolveAnswer(message, mathQuestion);
}

export function generateMathQuestion(): MathQuestion {
    var initialValue = Math.floor(Math.random() * 100) + 1;
    var isPlusOperator = Math.random() < 0.5;
    var term = Math.floor(Math.random() * 50) + 1;
    var timeForAnswering = calculateTimeForAnswering(initialValue, isPlusOperator, term);

    return new MathQuestion(initialValue, isPlusOperator, term, timeForAnswering);
}

export function calculateTimeForAnswering(initialValue: number, isPlusOperator: boolean, term: number): number {
    var answerTime = 0;

    if(isNumberMultipleOf(initialValue, 10)) answerTime += 1000;
    else if(isNumberMultipleOf(initialValue, 2)) answerTime += 2000;
    else answerTime += 3000;

    if(isNumberMultipleOf(term, 10)) answerTime += 1000;
    else answerTime += Math.ceil(term / 10) * 1000;

    if(isPlusOperator) answerTime += 2000;
    else answerTime += 4000;

    return answerTime;
}

export function isNumberMultipleOf(numberInQuestion: number, multiple: number): boolean {
    if(numberInQuestion % multiple === 0) return true;
    else return false;
}

function createQuestionMessage(question: MathQuestion): string {
    var mathOperator;
    if(question.isPlusOperator) mathOperator = " + ";
    else mathOperator = " - ";
    return "**Question:** " + question.initialValue + mathOperator + question.term + " = ?\nQuick, you only have " + question.timeForAnswering / 1000 + " seconds to answer!";
}

function collectAndResolveAnswer(message: Message, question: MathQuestion): void {
    const filter = (filteredMessage: Message) => filteredMessage.author.id === message.author.id;
    const AMOUNT_OF_MESSAGES_TO_COLLECT: number = 1;
    const collector = message.channel.createMessageCollector(filter, {max: AMOUNT_OF_MESSAGES_TO_COLLECT, time: question.timeForAnswering});

    collector.on("collect", (collectedMessage: any) => {
        replyBasedOnValidityOfAnswer(collectedMessage, question);
    });
    collector.on("end", (collectedMessages: any) => {
        replyIfNoMessagesWereSent(message, question, collectedMessages);
    });
}

function replyBasedOnValidityOfAnswer(message: Message, question: MathQuestion): void {
    if(parseInt(message.content) == question.result) {
        message.channel.send("Correct answer! :smile:\nYou have been granted " + question.timeForAnswering / 1000 + " Creative Credits for answering correctly!");
        CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), question.timeForAnswering / 1000);
    }
    else {
        message.channel.send("Wrong answer! The result was " + question.result + "! :frowning:\nYou have lost " + question.timeForAnswering / 1000 + " Creative Credits as a result!");
        CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), question.timeForAnswering / 1000 * -1);
    }
}

function replyIfNoMessagesWereSent(message: Message, question: MathQuestion, collectedMessages: any): void {
    if(collectedMessages.size == 0) {
        message.channel.send("You didn't answer in time! The correct answer would have been " + question.result + "! :sweat:\nYou have lost " + question.timeForAnswering / 1000 * 2 + " Creative Credits as a result!");
        CreditsHandler.incrementCreditsForUser(BigInt(message.author.id), question.timeForAnswering / 1000 * -2);
    }
}
