import {Message, CommandInteraction} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

export interface CreativeCommand {
    data: SlashCommandBuilder,
    name: string,
    aliases?: string[],
    description: string,
    syntax: string,
    minArgs: number,
    adminOnly: boolean,
    guildOnly: boolean
    category?: string,
    checkRequiredArgs?: (args: string[], message?: Message) => Promise<ArgsCheckResult>,
    execute: (message: Message, args: string[]) => void,
    executeInteraction: (interaction: CommandInteraction) => void
}

export interface ArgsCheckResult {
    valid: boolean,
    replyMessage?: string
}
