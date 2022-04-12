//import * as LogChamp from "../../scripts/logchamp";
import {Message} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/def/commanddef";
import * as Localizer from "../../scripts/localizer";

export class ReactionCommand implements CreativeCommand {
    name = Localizer.translate("react.name");
    description = Localizer.translate("react.description");
    syntax = Localizer.translate("react.syntax");
    minArgs = 2;
    adminOnly = true;
    guildOnly = true;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        return {valid: true};
    }

    execute(message: Message, args: string[]): void {
        //Nothing to test.
    }
}
