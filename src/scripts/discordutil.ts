import {client} from "../index";
import {User} from "discord.js";

export function getUserFromMention(mention: string): User | undefined {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if(!matches) {
        return;
    }
    const id = matches[1];
    return client.users.cache.get(id);
}
