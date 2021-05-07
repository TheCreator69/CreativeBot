import * as LogChamp from "../scripts/logchamp";

module.exports = {
    name: "warn",
    execute(message, client) {
        LogChamp.warn(message);
    }
};
