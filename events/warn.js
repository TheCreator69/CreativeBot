const LogChamp = require("../scripts/logchamp.js");

module.exports = {
    name: "warn",
    execute(message, client) {
        LogChamp.warn(message);
    }
};
