import {Message, Client} from "discord.js";
import * as LogChamp from "../scripts/logchamp";
import {EventAttributes} from "../scripts/eventdef";

export var info: EventAttributes = {
    name: "warn"
}

export function execute(message: Message, client: Client): void {
    LogChamp.warn(message.content);
}
