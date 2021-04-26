const config = require("../config.json");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log("Creative Bot has been started! Using environment: " + process.env.NODE_ENV);
        client.user.setPresence({
            status: "online",
            activity: {name: "Use '" + config.prefix + "help' to learn what I can do!"}
        });
        if(process.env.NODE_ENV == "development") {
            config.prefix = "dev ";
        }
    }
};
