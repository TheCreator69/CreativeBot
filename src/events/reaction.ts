import * as CreditsHandler from "../scripts/creditshandler";
import {MessageReaction, User, Client} from "discord.js";
import {EventAttributes} from "../scripts/eventdef";

export var info: EventAttributes = {
    name: "messageReactionAdd"
}

export async function execute(client: Client, messageReaction: MessageReaction, user: User) {
    await CreditsHandler.incrementCreditsForUser(BigInt(user.id), 10);
}
