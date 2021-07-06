import {Message, Client} from "discord.js";
import * as LogChamp from "../scripts/logchamp";
import {EventAttributes} from "../scripts/def/eventdef";

export var info: EventAttributes = {
    name: "error"
}

export function execute(client: Client, message: Message): void {
    LogChamp.error(message.content);
}
