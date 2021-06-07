//import * as LogChamp from "../../scripts/logchamp";
import {Message} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";
import * as Localizer from "../../scripts/localizer";

export class TestCommand implements CreativeCommand {
    name = Localizer.translate("test.name");
    description = Localizer.translate("test.description");
    syntax = Localizer.translate("test.syntax");
    min_args = 0;
    admin_only = true;
    guild_only = false;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        return {valid: true};
    }

    execute(message: Message, args: string[]): void {
        //Nothing to test.
    }
}
