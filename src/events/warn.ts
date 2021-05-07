import * as LogChamp from "../scripts/logchamp";

module.exports = {
    name: "warn",
    execute(message: any, client: any) {
        LogChamp.warn(message);
    }
};
