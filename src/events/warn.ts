import {Message, Client} from "discord.js";
import * as LogChamp from "../scripts/logchamp";
import {EventAttributes} from "../scripts/def/eventdef";

export var info: EventAttributes = {
    name: "warn"
}

export function execute(client: Client, message: Message): void {
    LogChamp.warn(message.content);
}
