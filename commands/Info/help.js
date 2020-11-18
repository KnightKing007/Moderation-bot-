const Discord = require("discord.js");
const { prefix } = require("../../config.json")

module.exports = {
  name: "help",
  category: "Info",
  usage: `${prefix}help`,

  run: async (client, message, args) => {


     const embed = new Discord.MessageEmbed()
    .setColor('#2C2F33')            
    .setFooter("Developed by andy2004")
    .setTitle(`Help menu`)
    .setDescription(`
    **Info**
    \`${prefix}help\` - shows help menu
    \`${prefix}botinfo\` - shows bot details
    \`${prefix}ping\` - shows bot latency

  **Moderation**
  \`${prefix}ban\` - bans someone
  \`${prefix}mute\` - mute someone
  \`${prefix}unmute\` - unmute someone
  \`${prefix}purge\` - delete messages from the channel
  \`${prefix}warn\` - warns someone`)
    await message.channel.send(embed);

    return;

}}