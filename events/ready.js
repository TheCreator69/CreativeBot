const config = require("../config.json");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log("Creative Bot has been started!");
        client.user.setPresence({
            status: "online",
            activity: {name: "Use ''" + config.prefix + "help' to learn what I can do!"}
        });
    }
};
