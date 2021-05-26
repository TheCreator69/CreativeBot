import {Client} from "discord.js";

export interface EventAttributes {
    name: string,
    once?: boolean
}

export interface CreativeEvent {
    info: EventAttributes,
    execute: (client: Client, ...args: any[]) => void
}
