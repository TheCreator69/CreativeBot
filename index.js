const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


// Set up event listener for new messages being posted
client.on('message', msg => {
  var content = msg.content
  if (content.startsWith('%')) {
    msg.reply("That's my queue!");
  }
});

client.login('***REMOVED***');
