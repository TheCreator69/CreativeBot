const Discord = require('discord.js');
const client = new Discord.Client();
 
const prefix = '%';
 
const fs = require('fs');
 
client.commands = new Discord.Collection();
 
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
 
    client.commands.set(command.name, command);
}
 
 
client.once('ready', () => {
    console.log('Codelyon is online!');
});
<<<<<<< HEAD


// Set up event listener for new messages being posted
client.on('message', msg => {
  var content = msg.content
  if (content.startsWith('%')) {
    msg.reply("That's my queue!");
  }
=======
 
client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
 
    if(command === 'ping'){
        client.commands.get('ping').execute(message, args);
    } 
>>>>>>> ca47ce4a27caea02c75be6e410735f5ecec86534
});
 
client.login('   ');