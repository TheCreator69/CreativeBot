module.exports = {
    name: "math",
    description: "Tests your math skills by giving an exercise and waiting for a quick response.",
    syntax: "math",
    min_args: 0,
    admin_only: false,
    execute(message: any, args: string[]) {
        var question = generateMathQuestion();
        message.channel.send(createMathMessage(question));
        collectAndResolveAnswer(message, question);
    }
};

function generateMathQuestion() {
    var initialValue = Math.floor(Math.random() * 100) + 1;
    var isPlusOperator = Math.random() < 0.5;
    var randomOperationValue = Math.floor(Math.random() * 50) + 1;

    var question = createQuestionMessage(initialValue, isPlusOperator, randomOperationValue);
    var time = calculateAnswerTime(initialValue, isPlusOperator, randomOperationValue);
    var result = calculateResult(initialValue, isPlusOperator, randomOperationValue);

    return {question: question, time: time, result: result};
}

function createQuestionMessage(initialValue: number, isPlusOperator: boolean, randomOperationValue: number) {
    var message = initialValue.toString();
    message += isPlusOperator ? " + " : " - ";
    message += randomOperationValue + " = ?";
    return message;
}

function calculateAnswerTime(initialValue: number, isPlusOperator: boolean, randomOperationValue: number) {
    var answerTime = 1000 + Math.floor(initialValue / 20) * 1000;
    answerTime += isPlusOperator ? Math.floor(randomOperationValue / 10) * 1000 : Math.floor(randomOperationValue / 8) * 1000;
    return answerTime;
}

function calculateResult(initialValue: number, isPlusOperator: boolean, randomOperationValue: number) {
    if(isPlusOperator) {
        return initialValue += randomOperationValue;
    }
    else {
        return initialValue -= randomOperationValue;
    }
}

function createMathMessage(question: any) {
    return "**Question:** " + question.question + "\nQuick, you only have " + question.time / 1000 + " seconds!";
}

function collectAndResolveAnswer(message: any, question: any) {
    const filter = (m: any) => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {max: 1, time: question.time});

    collector.on("collect", (collectedMessage: any) => {
        replyBasedOnValidityOfAnswer(collectedMessage, question);
    });
    collector.on("end", (collectedMessages: any) => {
        replyIfNoMessagesWereSent(message, question, collectedMessages);
    });
}

function replyBasedOnValidityOfAnswer(message: any, question: any) {
    if(parseInt(message.content) == question.result) {
        message.channel.send("Correct answer! :smile:");
    }
    else {
        message.channel.send("Wrong answer! The result was " + question.result + "! :frowning:");
    }
}

function replyIfNoMessagesWereSent(message: any, question: any, collectedMessages: any) {
    if(collectedMessages.size == 0) {
        message.channel.send("You didn't answer in time! The correct answer would have been " + question.result + "! :sweat:");
    }
}
