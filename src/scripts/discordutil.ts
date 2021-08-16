import {client} from "../index";
import {User} from "discord.js";
import * as LogChamp from "./logchamp";

export function getUserFromMention(mention: string): User | undefined {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if(!matches) {
        LogChamp.warn("No matches found for mention string!");
        return;
    }
    const id = matches[1];
    LogChamp.info("User match found from string", {id: id});
    return client.users.cache.get(id);
}
