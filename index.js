const Discord = require('discord.js');
const client = new Discord.Client();

const prefix = '%';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log("I'm online now!");
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    for(const possibleCommand of client.commands) {
        if(command == possibleCommand.name) {
            client.commands.get(possibleCommand.name).execute(message, args);
            return;
        }
    }
    message.channel.send('Sorry, but this command is invalid :frowning:');
});

client.login('ODIzMjA0MDg2ODgzMTU1OTY5.YFdajA.JWPdu-j0BSzd9tzZuRSSeSwEB7o');
