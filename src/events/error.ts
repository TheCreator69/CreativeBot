import * as LogChamp from "../scripts/logchamp";

module.exports = {
    name: "error",
    execute(message: any, client: any) {
        LogChamp.error(message);
    }
};
