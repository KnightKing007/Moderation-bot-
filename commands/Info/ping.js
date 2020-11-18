const Discord = require("discord.js");
const { prefix } = require("../../config.json")
module.exports = {
    name: "ping",
    category: "Info",
    usage: `${prefix}ping`,
  
    run: async (client, message, args) => {

        const embed = new Discord.MessageEmbed()
            .setDescription(`Pong! **${Math.round(client.ws.ping)}ms**`)
            .setColor('RANDOM')
        return message.channel.send(embed);
    }
};
