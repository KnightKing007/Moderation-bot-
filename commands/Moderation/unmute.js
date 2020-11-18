const { prefix } = require("../../config.json")

module.exports = {
    name: "unmute",
    category: "Moderation",
    usage: `${prefix}unmute (user)`,

    run: async (client, message, args) => {

      if (!message.member.hasPermission("MANAGE_ROLES")) {
        return message.channel.send({
            embed: {
                description: '**You dont have \`MANAGE_ROLES\` permission**'
            }
        });
      }
  
      if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        return message.channel.send("I don't have permission to manage roles");
      }
  
      const user = message.mentions.members.first();
  
      if (!user) {
        return message.channel.send(
          "Please mention the user that you want to unmute"
        );
      }
      
      let muterole = message.guild.roles.cache.find(x => x.name === "muted") //from database that make muted roles
      
      
   if(user.roles.cache.has(muterole)) {
        return message.channel.send()
      }
      
      
      user.roles.remove(muterole)
      
      await message.channel.send(`**${message.mentions.users.first().username}** is unmuted`)
      
      user.send(`You are now unmuted from **${message.guild.name}**`)

  }
}
