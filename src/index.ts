import * as Discord from "discord.js";
import * as credentials from "./credentials.json";
import * as fs from "fs";
import {CreativeCommand} from "./scripts/commanddef";

export const client = new Discord.Client();

var path = require("path");
var srcDirPath = getSourceDirPath();

function getSourceDirPath(): any {
    if(process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        return path.resolve(process.cwd(), "./src");
    }
    else {
        return path.resolve(process.cwd(), "./build");
    }
}

export var commands: Discord.Collection<string, CreativeCommand> = new Discord.Collection();
const commandFolders = fs.readdirSync(srcDirPath + "/commands");
for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`${srcDirPath}/commands/${folder}`).filter(function(file) {
        if(file.endsWith(".js") || file.endsWith(".ts")) {
            if(!file.endsWith(".test.ts")) {
                return true;
            }
            else return false;
        }
        else return false;
    });
    for(const file of commandFiles) {
        const command: CreativeCommand = require(`./commands/${folder}/${file}`);
        command.info.category = folder;
        commands.set(command.info.name, command);
    }
}

const eventFiles = fs.readdirSync(srcDirPath + "/events").filter(function(file) {
    if(file.endsWith(".js") || file.endsWith(".ts")) {
        if(!file.endsWith(".test.ts")) {
            return true;
        }
        else return false;
    }
    else return false;
});
for(const file of eventFiles) {
    const eventInstance = require(`${srcDirPath}/events/${file}`);
    if(eventInstance.info.once) {
        client.once(eventInstance.info.name, (...args) => eventInstance.execute(...args, client));
    }
    else {
        client.on(eventInstance.info.name, (...args) => eventInstance.execute(...args, client));
    }
}

client.login(credentials.token);
