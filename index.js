const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '%';

client.commands = new Discord.Collection();
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log("I'm online now!");
    client.user.setPresence({
        status: "online",
        activity: {name: "Use '%' to talk to me!"}
    });
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if(client.commands.has(command)) {
        commandMap = client.commands.get(command);
        commandMap.execute(message, args);
    }
    else {
        message.channel.send('Sorry, but this command is invalid :frowning:');
    }
});

client.login('ODIzMjA0MDg2ODgzMTU1OTY5.YFdajA.JWPdu-j0BSzd9tzZuRSSeSwEB7o');
