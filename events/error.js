const LogChamp = require("../scripts/logchamp.js");

module.exports = {
    name: "error",
    execute(message, client) {
        LogChamp.error(message);
    }
};
