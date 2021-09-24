import {Client} from "discord.js";
import * as config from "../config.json";
import {LogChamp, Category} from "../scripts/logchamp";
import {EventAttributes} from "../scripts/def/eventdef";
import * as TimedEventScheduler from "../scripts/tokensystem/timedeventscheduler";

var logChampInst = new LogChamp(Category.Startup);

export var info: EventAttributes = {
    name: "ready",
    once: true
}

export function execute(client: Client) {
    if(client.user !== null) {
        client.user.setPresence({
            status: "online",
            //@ts-ignore
            activities: [{name: "Use '" + config.prefix + "help' to learn what I can do!"}]
        });
        TimedEventScheduler.scheduleTimedJobs();
        logChampInst.info("Creative Bot has been started!", {botname: client.user?.username, env: process.env.NODE_ENV});
    }
}
