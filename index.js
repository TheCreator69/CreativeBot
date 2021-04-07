const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.commands = new Discord.Collection();
const fs = require("fs");

const commandFolders = fs.readdirSync("./commands");
for(const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
    for(const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        command.category = folder;
        client.commands.set(command.name, command);
    }
}

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

client.login(config.token);

exports.client = client;
exports.commandMap = client.commands;
