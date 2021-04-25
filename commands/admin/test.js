const Sequelize = require("sequelize");
const AdminScript = require("../../scripts/admincheck.js");

module.exports = {
    name: "test",
    description: "Dummy test command to test functionality in a clean js file.",
    syntax: "test",
    min_args: 0,
    admin_only: true,
    async execute(message, args) {
        message.channel.send("Nothing to test right now...");
    }
};
