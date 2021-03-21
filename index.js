const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


// Reply to every "ping" message with a "pong"
// hello TheCreator am big fan x)
client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.login('ODIzMjA0MDg2ODgzMTU1OTY5.YFdajA.JWPdu-j0BSzd9tzZuRSSeSwEB7o');
