//import * as LogChamp from "../../scripts/logchamp";
import {Message} from "discord.js";
import {CreativeCommand, ArgsCheckResult} from "../../scripts/commanddef";

export class TestCommand implements CreativeCommand {

    constructor(_testMessage?: string) {
        if(_testMessage !== undefined) {
            this.description = _testMessage;
        }
    }

    name = "test";
    description = "Tests functionality in a clean ts file";
    syntax = "test";
    min_args = 0;
    admin_only = true;
    guild_only = false;

    async checkRequiredArgs(args: string[]): Promise<ArgsCheckResult> {
        return {valid: true};
    }

    execute(message: Message, args: string[]): void {
        //Nothing to test.
    }

    getDescription(): string {
        return this.description;
    }
}
