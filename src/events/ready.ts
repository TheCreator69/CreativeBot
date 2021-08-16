import {Client} from "discord.js";
import * as config from "../config.json";
import * as LogChamp from "../scripts/logchamp";
import {EventAttributes} from "../scripts/def/eventdef";
import * as TimedEventScheduler from "../scripts/tokensystem/timedeventscheduler";

export var info: EventAttributes = {
    name: "ready",
    once: true
}

export function execute(client: Client) {
    if(client.user !== null) {
        client.user.setPresence({
            status: "online",
            activity: {name: "Use '" + config.prefix + "help' to learn what I can do!"}
        });
        TimedEventScheduler.scheduleTimedJobs();
        LogChamp.info("Creative Bot has been started!", {username: client.user?.username});
    }
}
