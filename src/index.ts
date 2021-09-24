import {Client, Collection, Intents} from "discord.js";
import * as fs from "fs";
import path from "path";
import * as credentials from "./credentials.json";
import {CreativeCommand} from "./scripts/def/commanddef";
import {CreativeEvent} from "./scripts/def/eventdef";
import * as CommandFactory from "./scripts/commandfactory";
import * as Localizer from "./scripts/localizer";
import {LogChamp, Category} from "./scripts/logchamp";

var logChampInst = new LogChamp(Category.Startup);

const myIntents = new Intents();
myIntents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
);
//@ts-ignore
export const client = new Client({intents: myIntents});
export var commands: Collection<string, CreativeCommand> = new Collection();

startBot();

async function startBot() {
    await Localizer.initializeLocalizer();

    var srcDirPath = getAbsoluteSourceDirPathForEnv();
    readCommandFilesAndRegisterCommands(srcDirPath);
    readEventFilesAndListenToEvents(srcDirPath);

    client.login(credentials.token);
}

function getAbsoluteSourceDirPathForEnv(): any {
    if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        logChampInst.info("Running bot from src folder");
        return path.resolve(process.cwd(), "./src");
    }
    else {
        logChampInst.info("Running bot from build folder");
        return path.resolve(process.cwd(), "./build");
    }
}

function readCommandFilesAndRegisterCommands(srcDirPath: string): void {
    const commandFolders = fs.readdirSync(`${srcDirPath}/commands`);

    for(const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`${srcDirPath}/commands/${folder}`).filter(filterDirectoryForTSAndJSFilesWithoutTests);

        for(const file of commandFiles) {
            const commandModule = require(`./commands/${folder}/${file}`);
            var commandInstance = CommandFactory.createCommand(file, commandModule);

            if(commandInstance === undefined) return;
            commandInstance.category = folder;
            commands.set(commandInstance.name, commandInstance);
            logChampInst.info("Added command to commandList", {name: commandInstance.name, fileName: file, folder: folder});
        }
    }
}

function readEventFilesAndListenToEvents(srcDirPath: string): void {
    const eventFiles = fs.readdirSync(`${srcDirPath}/events`).filter(filterDirectoryForTSAndJSFilesWithoutTests);

    for(const file of eventFiles) {
        const eventInstance: CreativeEvent = require(`./events/${file}`);

        if(eventInstance.info.once) {
            client.once(eventInstance.info.name, (...args) => eventInstance.execute(client, ...args));
            logChampInst.info("Event fired once", {name: eventInstance.info.name});
        }
        else {
            client.on(eventInstance.info.name, (...args) => eventInstance.execute(client, ...args));
            logChampInst.info("Event fired", {name: eventInstance.info.name});
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
