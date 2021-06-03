import {Message} from "discord.js";

export interface CreativeCommand {
    name: string,
    description: string,
    syntax: string,
    min_args: number,
    admin_only: boolean,
    guild_only: boolean
    category?: string,
    checkRequiredArgs?: (args: string[], message?: Message) => Promise<ArgsCheckResult>,
    execute: (message: Message, args: string[]) => void
}

export interface ArgsCheckResult {
    valid: boolean,
    replyMessage?: string
}
