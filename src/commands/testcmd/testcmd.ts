//import * as LogChamp from "../../scripts/logchamp";
import {Message} from "discord.js";

module.exports = {
    name: "test",
    description: "Tests functionality in a clean js file.",
    syntax: "test",
    min_args: 0,
    admin_only: true,
    execute(message: Message, args: string[]) {
        //No test
    }
};
