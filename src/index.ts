import * as Discord from "discord.js";
import * as credentials from "./credentials.json";
import * as fs from "fs";
import {CreativeCommand} from "./scripts/commanddef";
import path from "path";

export const client = new Discord.Client();
export var commands: Discord.Collection<string, CreativeCommand> = new Discord.Collection();

startBot();

function startBot() {
    var srcDirPath = getAbsoluteSourceDirPathForEnv();
    readCommandFilesAndRegisterCommands(srcDirPath);
    readEventFilesAndListenToEvents(srcDirPath);
    client.login(credentials.token);
}

function getAbsoluteSourceDirPathForEnv(): any {
    if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        return path.resolve(process.cwd(), "./src");
    }
    else {
        return path.resolve(process.cwd(), "./build");
    }
}

function readCommandFilesAndRegisterCommands(srcDirPath: string): void {
    const commandFolders = fs.readdirSync(`${srcDirPath}/commands`);
    for(const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${srcDirPath}/commands/${folder}`).filter(filterDirectoryForTSAndJSFilesWithoutTests);
        for(const file of commandFiles) {
            const command: CreativeCommand = require(`./commands/${folder}/${file}`);
            command.info.category = folder;
            commands.set(command.info.name, command);
        }
    }
}

function readEventFilesAndListenToEvents(srcDirPath: string): void {
    const eventFiles = fs.readdirSync(`${srcDirPath}/events`).filter(filterDirectoryForTSAndJSFilesWithoutTests);
    for(const file of eventFiles) {
        const eventInstance = require(`./events/${file}`);
        if(eventInstance.info.once) {
            client.once(eventInstance.info.name, (...args) => eventInstance.execute(...args, client));
        }
        else {
            client.on(eventInstance.info.name, (...args) => eventInstance.execute(...args, client));
        }
    }
}

function filterDirectoryForTSAndJSFilesWithoutTests(file: string): boolean {
    if(file.endsWith(".js") || file.endsWith(".ts")) {
        if(!file.endsWith(".test.ts")) {
            return true;
        }
        else return false;
    }
    else return false;
}
