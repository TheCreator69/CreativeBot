import {Message} from "discord.js";

export interface CreativeCommand {
    name: string,
    aliases?: string[],
    description: string,
    syntax: string,
    minArgs: number,
    adminOnly: boolean,
    guildOnly: boolean
    category?: string,
    checkRequiredArgs?: (args: string[], message?: Message) => Promise<ArgsCheckResult>,
    execute: (message: Message, args: string[]) => void
}

export interface ArgsCheckResult {
    valid: boolean,
    replyMessage?: string
}
