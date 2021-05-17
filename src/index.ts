import * as Discord from "discord.js";
import * as credentials from "./credentials.json";
import * as fs from "fs";

export const client = new Discord.Client();

var changeDirFolder = "src";
if(process.env.NODE_ENV === "development") {
    changeDirFolder = "src";
}
else {
    changeDirFolder = "build";
}
if(process.platform === "win32") {
    process.chdir(`${process.cwd()}\\${changeDirFolder}`);
}
else if(process.platform === "linux") {
    process.chdir(`${process.cwd()}/${changeDirFolder}`);
}

export var commands: Discord.Collection<string, any> = new Discord.Collection();
const commandFolders = fs.readdirSync("./commands");
for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(function(file) {
        if(file.endsWith(".js") || file.endsWith(".ts")) {
            if(!file.endsWith(".test.ts")) {
                return true;
            }
            else return false;
        }
        else return false;
    });
    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        command.info.category = folder;
        commands.set(command.info.name, command);
    }
}

const eventFiles = fs.readdirSync("./events").filter(function(file) {
    if(file.endsWith(".js") || file.endsWith(".ts")) {
        if(!file.endsWith(".test.ts")) {
            return true;
        }
        else return false;
    }
    else return false;
});
for(const file of eventFiles) {
    const eventInstance = require(`./events/${file}`);
    if(eventInstance.info.once) {
        client.once(eventInstance.info.name, (...args) => eventInstance.execute(...args, client));
    }
    else {
        client.on(eventInstance.info.name, (...args) => eventInstance.execute(...args, client));
    }
}

client.login(credentials.token);
