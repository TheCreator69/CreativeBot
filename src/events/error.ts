import {Message, Client} from "discord.js";
import {LogChamp, Category} from "../scripts/logchamp";
import {EventAttributes} from "../scripts/def/eventdef";

var logChampInst = new LogChamp(Category.DiscordJSEvent);

export var info: EventAttributes = {
    name: "error"
}

export function execute(client: Client, message: Message): void {
    logChampInst.error(message.content);
}
