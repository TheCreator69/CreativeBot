import * as Discord from "discord.js";
import * as credentials from "./credentials.json";
import * as fs from "fs";

export const client = new Discord.Client();

if(process.platform === "win32") {
    process.chdir(`${process.cwd()}\\build`);
}
else if(process.platform === "linux") {
    process.chdir(`${process.cwd()}/build`);
}

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync("./commands");
for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        command.category = folder;
        client.commands.set(command.name, command);
    }
}
export var commandMap = client.commands;

const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
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
