const LogChamp = require("../../scripts/logchamp.js");

module.exports = {
    name: "test",
    description: "Dummy test command to test functionality in a clean js file.",
    syntax: "test",
    min_args: 0,
    admin_only: true,
    execute(message, args) {
        //Nothing to test here right now...
    }
};
