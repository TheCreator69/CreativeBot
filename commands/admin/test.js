const Sequelize = require("sequelize");
const CreditsHandler = require("../../scripts/creditshandler.js");

module.exports = {
    name: "test",
    description: "Dummy test command to test functionality in a clean js file.",
    syntax: "test",
    min_args: 0,
    admin_only: true,
    async execute(message, args) {
        var userCredits = await CreditsHandler.getCreditsForUser(message.author.id);
        console.log("User's credits: " + userCredits);
        await CreditsHandler.updateCreditsForUser(message.author.id, 5);
        userCredits = await CreditsHandler.getCreditsForUser(message.author.id);
        console.log("User's credits: " + userCredits);
    }
};
