const Discord = require("discord.js");
const { prefix } = require("../../config.json")
module.exports = {
    name: "ban",
    category: "Moderation",
    usage: `${prefix}ban (User ID) + (reason)`,

    run: async(client, message, args) => {

        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
            let botnopermsembed = new Discord.MessageEmbed()
                .setDescription(
                    "I don't have the `ban` permission"
                )
                .setColor("#0B0B0B");
            message.channel.send(botnopermsembed);

            return;
        }
        if (!message.member.permissions.has("BAN_MEMBERS")) {
            let nopermsembed = new Discord.MessageEmbed()
                .setDescription(
                    "You don't have the `ban` permission"
                )
                .setColor("#0B0B0B");
            message.channel.send(nopermsembed);

            return;
        }
        let Member = message.mentions.users.first();

        if (!Member)
            return message.channel.send({
                embed: {
                    color: 0x0B0B0B,
                    description: `Please mention a user to ban`
                }
            });

        if (!message.guild.members.cache.get(Member.id))
            return message.channel.send({
                embed: {
                    color: 0x4D5E94,
                    description: `**Please mention a valid user**`
                }
            });


        if (Member.id === message.author.id)
            return message.channel.send({
                embed: {
                    color: 0x4D5E94,
                    description: ` **You can't ban yourself**`
                }
            });

        if (Member.id === client.user.id)
            return message.channel.send({
                embed: {
                    color: 0x4D5E94,
                    description: `**You can't ban me**`
                }
            });

        if (Member.id === message.guild.owner.user.id)
            return message.channel.send({
                embed: {
                    color: 0x4D5E94,
                    description: `**You can't ban the server owner**`
                }
            });

        let Reason = args.slice(1).join(" ");

        let User = message.guild.member(Member);

        let BotRole = message.guild.member(message.guild.me).roles.highest.position;

        let Role = User.roles.highest.position;

        let UserRole = message.member.roles.highest.position;

        if (UserRole <= Role) return message.channel.send({
            embed: {
                color: 0x4D5E94,
                description: `**I can't ban this user because this user has role position higher than my role or same role as you**`
            }
        });

        if (BotRole <= Role) return message.channel.send({
            embed: {
                color: 0x4D5E94,
                description: `**I can't ban this user because this user has role position higher than my role or same role as me**`
            }
        });

        if (!User.bannable) return message.channel.send({
            embed: {
                color: 0x4D5E94,
                description: `**I can't ban this user**`
            }
        })

        try {
            setTimeout(function() {
                User.ban({ reason: `${Reason || "No reason was given."}` });
            }, 2000);
            let embed = new Discord.MessageEmbed()
                .setColor('#2C2F33')
                .setTitle(`This user was banned succesfully.`)
                .addField(`Responsible moderator`,`${message.author.tag}`)
                .addField(`Banned user`, `${Member.tag} (${Member.id})`)
                .addField(`Reason`, `${Reason || "No reason was given."}`)
                .setFooter(client.user.username, client.user.displayAvatarURL())
                .setTimestamp();
            if (User && Member.bot === false)
                Member.send(
                    `Hello, you have been banned from **${message.guild.name}** for ${Reason ||
            "No reason was given."}`
                );
            message.channel.send(embed);
        } catch (error) {
            return message.channel
                .send({
                    embed: {
                        color: 0x4D5E94,
                        description: `**I can't ban this user maybe this user has higher role than me and my role is lower than user**`
                    }
                })
                .then(() => console.log(error));
            }}
    
    } 