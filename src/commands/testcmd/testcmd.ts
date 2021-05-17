//import * as LogChamp from "../../scripts/logchamp";
import {Message} from "discord.js";
import {CreativeCommandAttributes} from "../../scripts/commanddef";

export var info: CreativeCommandAttributes = {
    name: "test",
    description: "Tests functionality in a clean ts file.",
    syntax: "test",
    min_args: 0,
    admin_only: true,
}

export function execute(message: Message, args: string[]) {
    //Nothing to test.
}
