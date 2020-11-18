const { MessageEmbed } = require("discord.js");
const db = require('quick.db');
const { prefix } = require("../../config.json")

module.exports = {
    name: "mute",
    category: "Moderation",
    usage: `${prefix}mute (User ID) + (reason)`,

    run: async(client, message, args) => {

    try {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("**You don't have the `MUTE` permission - [MANAGE_GUILD]**");

        if (!message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send("**I don't have the `MUTE` permission - [MANAGE_GUILD]**")
        if (!args[0]) return message.channel.send("**Please mention a user to mute**");

        var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
        if (!mutee) return message.channel.send("**Please mention a valid user to mute**");

        if (mutee === message.member) return message.channel.send("**You can't mute yourself**")
        if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Cannot Mute This User!**')

        let reason = args.slice(1).join(" ");
        if (mutee.user.bot) return message.channel.send("**I can't mute bots**");
        const userRoles = mutee.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r.id)

        let muterole;
        let dbmute = await db.fetch(`muterole_${message.guild.id}`);
        let muteerole = message.guild.roles.cache.find(r => r.name === "muted")

        if (!message.guild.roles.cache.has(dbmute)) {
            muterole = muteerole
        } else {
            muterole = message.guild.roles.cache.get(dbmute)
        }

        if (!muterole) {
            try {
                muterole = await message.guild.roles.create({
                    data: {
                        name: "muted",
                        color: "#514f48",
                        permissions: []
                    }
                })
                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.createOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SPEAK: false,
                        CONNECT: false,
                    })
                })
            } catch (e) {
                console.log(e);
            }
        };

        if (mutee.roles.cache.has(muterole.id)) return message.channel.send("**This user is already muted**")

        db.set(`muteeid_${message.guild.id}_${mutee.id}`, userRoles)
      try {
        mutee.roles.set([muterole.id]).then(() => {
            mutee.send(`You have been muted in ${message.guild.name} - **${reason || "No reason was given"}**`).catch(() => null)
        })
        } catch {
             mutee.roles.set([muterole.id])                               
        }
            if (reason) {
            const sembed = new MessageEmbed()
                .setColor("GREEN")
                .setAuthor(message.guild.name, message.guild.iconURL())
                .setDescription(`**${mutee.user.username}** was successfully muted for \nReason: **${reason}**`)
            message.channel.send(sembed);
            } else {
                const sembed2 = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`**${mutee.user.username}** was successfully muted`)
            message.channel.send(sembed2);
            }
        } catch {
            return;
        }
    }
}