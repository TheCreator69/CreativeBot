import * as CreditsHandler from "../scripts/creditshandler";
import {MessageReaction, User, Client} from "discord.js";

module.exports = {
    name: "messageReactionAdd",
    async execute(messageReaction: MessageReaction, user: User, client: Client) {
        await CreditsHandler.incrementCreditsForUser(BigInt(user.id), 10);
    }
};
