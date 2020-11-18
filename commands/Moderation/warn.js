const Discord = require('discord.js');
const db = require('quick.db');
const { prefix } = require("../../config.json")

module.exports = {
    name: "warn",
    category: "Moderation",
    usage: `${prefix}warn`,

    run: async(client, message, args) => {

    if (!message.guild.me.permissions.has("MANAGE_SERVER")) {
        let botnopermsembed = new Discord.MessageEmbed()
            .setDescription(
                "I don't have the `MANAGE_SERVER` permission"
            )
            .setColor("#0B0B0B");
        message.channel.send(botnopermsembed);

        return;
            }
            if (!message.member.permissions.has("MANAGE_SERVER")) {
                let nopermsembed = new Discord.MessageEmbed()
                    .setDescription(
                        "You don't have the `MANAGE_SERVER` permission"
                    )
                    .setColor("#0B0B0B");
                message.channel.send(nopermsembed);
    
                return;
            }

        const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

        if(!user) return message.channel.send({
            embed: {
                color: 0x0B0B0B,
                description: `Please mention a user`
            }
        });

        if(user.bot) return message.channel.send({
            embed: {
                color: 0x0B0B0B,
                description: `You can\`t warn bots`
            }
        });

        if(message.guild.owner.id === user.id) return message.channel.send({
            embed: {
                color: 0x0B0B0B,
                description: `You can\`t warn the server owner`
            }
        });

        let reason = args.slice(1).join(" ");

        if(!reason) reason = 'Unspecified';

        let warnings = db.get(`warnings_${message.guild.id}_${user.id}`);

        if(warnings === null) {
            db.set(`warnings_${message.guild.id}_${user.id}`, 1);
            await message.channel.send(`**${user.username}** has been warned`)
        }

        if(warnings !== null){
            db.add(`warnings_${message.guild.id}_${user.id}`, 1)
            await message.channel.send(`**${user.username}** has been warned`)
        }
    }
}