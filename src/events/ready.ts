const config = require("../config.json");
import * as LogChamp from "../scripts/logchamp";

module.exports = {
    name: "ready",
    once: true,
    execute(client: any) {
        LogChamp.info("Creative Bot has been started! Using environment: " + process.env.NODE_ENV);
        client.user.setPresence({
            status: "online",
            activity: {name: "Use '" + config.prefix + "help' to learn what I can do!"}
        });
        if(process.env.NODE_ENV == "development" || process.env.NODE_ENV == "build") {
            config.prefix = "dev ";
        }
    }
};
