module.exports = {
    name: "math",
    description: "Tests your math skills by giving an exercise and waiting for a quick response.",
    syntax: "math",
    min_args: 0,
    admin_only: false,
    execute(message, args) {
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

function createQuestionMessage(initialValue, isPlusOperator, randomOperationValue) {
    var message = initialValue;
    message += isPlusOperator ? " + " : " - ";
    message += randomOperationValue + " = ?";
    return message;
}

function calculateAnswerTime(initialValue, isPlusOperator, randomOperationValue) {
    var answerTime = 1000 + Math.floor(initialValue / 20) * 1000;
    answerTime += isPlusOperator ? Math.floor(randomOperationValue / 10) * 1000 : Math.floor(randomOperationValue / 8) * 1000;
    return answerTime;
}

function calculateResult(initialValue, isPlusOperator, randomOperationValue) {
    var result = initialValue;
    if(isPlusOperator) {
        return initialValue += randomOperationValue;
    }
    else {
        return initialValue -= randomOperationValue;
    }
}

function createMathMessage(question) {
    return "**Question:** " + question.question + "\nQuick, you only have " + question.time / 1000 + " seconds!";
}

function collectAndResolveAnswer(message, question) {
    const filter = m => m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, {max: 1, time: question.time});

    collector.on("collect", collectedMessage => {
        replyBasedOnValidityOfAnswer(collectedMessage, question);
    });
    collector.on("end", collectedMessages => {
        replyBasedOnQuantityOfMessages(message, question, collectedMessages);
    });
}

function replyBasedOnValidityOfAnswer(message, question) {
    if(parseInt(message.content) == question.result) {
        message.channel.send("Correct answer! :smile:");
    }
    else {
        message.channel.send("Wrong answer! The result was " + question.result + "! :frowning:");
    }
}

function replyBasedOnQuantityOfMessages(message, question, collectedMessages) {
    if(collectedMessages.size == 0) {
        message.channel.send("You didn't answer in time! The correct answer would have been " + question.result + "! :sweat:");
    }
}
