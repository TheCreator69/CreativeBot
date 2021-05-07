import * as LogChamp from "../scripts/logchamp";

module.exports = {
    name: "error",
    execute(message, client) {
        LogChamp.error(message);
    }
};
