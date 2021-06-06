import {Client} from "discord.js";
const config = require("../config.json");
import * as LogChamp from "../scripts/logchamp";
import {EventAttributes} from "../scripts/eventdef";
import * as Localizer from "../scripts/localizer";

export var info: EventAttributes = {
    name: "ready",
    once: true
}

export function execute(client: Client) {
    LogChamp.info("Creative Bot has been started! Using environment: " + process.env.NODE_ENV);
    if(process.env.NODE_ENV !== "maintenance") {
        startNormally(client);
    }
    else {
        startInMaintenanceMode(client);
    }
    if(process.env.NODE_ENV == "development" || process.env.NODE_ENV == "build") {
        config.prefix = "dev ";
    }
}

function startNormally(client: Client): void {
    if(client.user !== null) {
        client.user.setPresence({
            status: "online",
            activity: {name: "Use '" + config.prefix + "help' to learn what I can do!"}
        });
    }
}

function startInMaintenanceMode(client: Client): void {
    if(client.user !== null) {
        client.user.setPresence({
            status: "dnd",
            activity: {name: Localizer.translate("readyEvent.maintenanceStatus")}
        });
    }
}
