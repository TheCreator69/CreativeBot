import {client} from "../index";
import {User} from "discord.js";
import {LogChamp, Category} from "./logchamp";

var logChampInst = new LogChamp(Category.TextProcessing);

export function getUserFromMention(mention: string): User | undefined {
    const matches = mention.match(/^<@!?(\d+)>$/);
    if(!matches) {
        logChampInst.warn("No matches found for mention string!");
        return;
    }
    const id = matches[1];
    logChampInst.debug("User match found from string", {id: id});
    return client.users.cache.get(id);
}
