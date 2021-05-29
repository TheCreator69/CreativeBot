import {Message} from "discord.js";

export interface CreativeCommand {
    name: string,
    description: string,
    syntax: string,
    min_args: number,
    admin_only: boolean,
    category?: string,
    checkRequiredArgs?: (message: Message, args: string[]) => Promise<boolean>,
    execute: (message: Message, args: string[]) => void
}
