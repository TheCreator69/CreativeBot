const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");
const prefix = config.prefix;

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

client.once("ready", () => {
    console.log("I'm online now!");
    client.user.setPresence({
        status: "online",
        activity: {name: "Use '" + config.prefix + "' to talk to me!"}
    });
});

client.on("message", message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(client.commands.has(command)) {
        var commandMapEntry = client.commands.get(command);
        commandMapEntry.execute(message, args);
    }
    else {
        message.channel.send("Sorry, but this command is invalid :frowning:");
    }
});

process.on("unhandledRejection", error => {
    console.error("Unhandled rejection: ", error);
});

client.login(config.token);

exports.commandMap = client.commands;
