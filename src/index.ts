import * as Discord from "discord.js";
import * as credentials from "./credentials.json";
import * as fs from "fs";

export const client = new Discord.Client();

var changeDirFolder: string = "src";
if(process.env.NODE_ENV === "development") {
    changeDirFolder = "src";
}
else if(process.env.NODE_ENV === "build") {
    changeDirFolder = "build";
}
if(process.platform === "win32") {
    process.chdir(`${process.cwd()}\\${changeDirFolder}`);
}
else if(process.platform === "linux") {
    process.chdir(`${process.cwd()}/${changeDirFolder}`);
}

export var commandMap: Discord.Collection<string, any> = new Discord.Collection();
const commandFolders = fs.readdirSync("./commands");
for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(function(file) {
        if(file.endsWith(".js") || file.endsWith(".ts")) {
            return true;
        }
        else return false;
    });
    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        command.category = folder;
        commandMap.set(command.name, command);
    }
}

const eventFiles = fs.readdirSync("./events").filter(function(file) {
    if(file.endsWith(".js") || file.endsWith(".ts")) {
        return true;
    }
    else return false;
});
for(const file of eventFiles) {
    const eventInstance = require(`./events/${file}`);
    if(eventInstance.once) {
        client.once(eventInstance.name, (...args) => eventInstance.execute(...args, client));
    }
    else {
        client.on(eventInstance.name, (...args) => eventInstance.execute(...args, client));
    }
}

client.login(credentials.token);
