import {Message} from "discord.js";

export interface CreativeCommandAttributes {
    name: string,
    description: string,
    syntax: string,
    min_args: number,
    admin_only: boolean,
    category?: string,
}

export interface CreativeCommand {
    info: CreativeCommandAttributes,
    checkRequiredArgs: (message: Message, args: string[]) => boolean,
    execute: (message: Message, args: string[]) => void
}
