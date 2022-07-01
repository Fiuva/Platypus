const { MessageEmbed, MessageCollector, ReactionCollector } = require("discord.js");
const config = require(`${process.cwd()}/config/config.json`);
const { MascotasData } = require("../../models/mascotas");
const { findOrCreateDocument } = require("../funciones");
const { buscarMejorMascota, nombreRol, desequipar, mascotaEquipada } = require("../juegos/funcionesMascotas");

var onClickIntercambio = async function (button, client) {
    var id = button.customId.split('_');
    if (id[1] == 'aceptar' && button.user.id == id[2]) {
        const tiempo = 200; //seg
        const user = (await button.guild.members.fetch(id[3])).user;
        var embed = new MessageEmbed()
            .setTitle(`${user.username} y ${button.user.username} están intercambiando mascotas`)
            .setColor("GREEN")
            .setDescription(`*!add <mascota> | !remove <numero>* \n Termina <t:${(Date.now() + tiempo * 1000)/1000<<0}:R>`)
            .setFields(
                { name: `${user.username} da:`, value: `•`, inline: true },
                { name: `${button.user.username} da:`, value: `•`, inline: true }
        )
        await button.message.edit({ embeds: [embed], components: [] });
        button.deferUpdate();
        const filter = (m) => [id[2], id[3]].includes(m.author.id) && (m.content.startsWith(`${config.prefix}add `) || m.content.startsWith(`${config.prefix}remove `));
        const collector = new MessageCollector(button.channel, { filter: filter, time: tiempo * 1000 });
        const mascotasUser = await findOrCreateDocument(id[3], MascotasData);
        const mascotasToUser = await findOrCreateDocument(id[2], MascotasData);
        var data = {
            user1: {
                mascotas: [],
                listo: false
            },
            user2: {
                mascotas: [],
                listo: false
            }
        }
        const rCollector = new ReactionCollector(button.message, { filter: (r, u) => !u.bot, time: tiempo * 1000, dispose: true });
        button.message.react('✅');
        button.message.react('❌');
        rCollector.on('collect', async (reaction, user) => {
            if (![id[2], id[3]].includes(user.id)) reaction.remove();
            if (reaction.emoji.name == '✅') {
                if (user.id == mascotasUser.idDiscord) {
                    if (!data.user1.listo) {
                        data.user1.listo = true;
                        actualizarFields();
                    }
                } else {
                    if (!data.user2.listo) {
                        data.user2.listo = true;
                        actualizarFields();
                    }
                }
                if (data.user1.listo && data.user2.listo) {
                    collector.stop('manual');
                    rCollector.stop();
                    button.message.reactions.removeAll();
                    await intercambiarMascotas();
                    embed.setDescription(`Se han intercambiado las mascotas`).setColor("BLURPLE");
                    await button.message.edit({ embeds: [embed] });
                }
            } else if (reaction.emoji.name == '❌') {
                collector.stop('manual');
                rCollector.stop();
                button.message.reactions.removeAll();
                await button.message.edit({ embeds: [new MessageEmbed().setTitle(`${user.username} ha cancelado el intercambio`).setColor("RED")], components: [] });
            } else {
                reaction.remove();
            }
        })
        rCollector.on('remove', (reaction, user) => {
            if (reaction.emoji.name == '✅') {
                if (user.id == mascotasUser.idDiscord)
                    data.user1.listo = false;
                else
                    data.user2.listo = false;
                actualizarFields();
            }
        })
        collector.on('collect', async msg => {
            if (msg.content.startsWith(`${config.prefix}add `)) {
                const args = msg.content.slice(config.prefix.length).trim().split(" ");
                args.shift();
                if (msg.author.id == mascotasUser.idDiscord) {
                    if (data.user1.mascotas.length >= 9) {
                        msg.channel.send(`${msg.author} solo puedes intercambiar 9 mascotas a la vez`);
                        return msg.delete();
                    }
                    try {
                        const mascota = buscarMejorMascota(mascotasUser, args.join(' '));
                        if (Array.isArray(mascota)) return msg.reply(mascota[1]);
                        msg.delete();
                        mascotasUser.mascotas.splice(mascotasUser.mascotas.indexOf(mascota), 1);
                        data.user1.mascotas.push(mascota);
                        data.user1.listo = false;
                        data.user2.listo = false;
                        await actualizarFields();
                    } catch (e) {
                        msg.reply(e.message);
                    }
                } else {
                    if (data.user2.mascotas.length >= 9) {
                        msg.channel.send(`${msg.author} solo puedes intercambiar 9 mascotas a la vez`);
                        return msg.delete();
                    }
                    try {
                        const mascota = buscarMejorMascota(mascotasToUser, args.join(' '));
                        if (Array.isArray(mascota)) return msg.reply(mascota[1]);
                        msg.delete();
                        mascotasToUser.mascotas.splice(mascotasToUser.mascotas.indexOf(mascota), 1);
                        data.user2.mascotas.push(mascota);
                        data.user1.listo = false;
                        data.user2.listo = false;
                        await actualizarFields();
                    } catch (e) {
                        msg.reply(e.message);
                    }
                }
            } else if (msg.content.startsWith(`${config.prefix}remove `)) {
                const args = msg.content.slice(config.prefix.length).trim().split(" ");
                var index = parseInt(args[1]) - 1;
                if (isNaN(index)) return msg.reply(`Pon el número de la mascota que quieres quitar`)
                if (msg.author.id == mascotasUser.idDiscord) {
                    if (index < 0 || index >= data.user1.mascotas.length) return msg.reply(`Tienes que poner un número válido`);
                    mascotasUser.mascotas.push(data.user1.mascotas[index]);
                    data.user1.mascotas.splice(index, 1);
                    msg.delete();
                    data.user1.listo = false;
                    data.user2.listo = false;
                    await actualizarFields();
                } else {
                    if (index < 0 || index >= data.user2.mascotas.length) return msg.reply(`Tienes que poner un número válido`);
                    mascotasUser.mascotas.push(data.user2.mascotas[index]);
                    data.user2.mascotas.splice(index, 1);
                    msg.delete();
                    data.user1.listo = false;
                    data.user2.listo = false;
                    await actualizarFields();
                }
            }
            
        });
        collector.on('end', async (collected, reason) => {
            if (reason == 'manual') return;
            embed.setDescription(`Cerrado por limite de tiempo`).setColor("GREY");
            button.message.reactions.removeAll();
            await button.message.edit({ embeds: [embed] });
        });

        async function actualizarFields() {
            embed.setFields(
                { name: `${user.username} da:`, value: value(data.user1), inline: true },
                { name: `${button.user.username} da:`, value: value(data.user2), inline: true })

            if (!data.user1.listo) {
                button.message.reactions.resolve('✅').users.remove(mascotasUser.idDiscord);
            } else if (!data.user2.listo) {
                button.message.reactions.resolve('✅').users.remove(mascotasToUser.idDiscord);
            }

            function value(userData) {
                var value = `•`;
                for (var i = 0; i < userData.mascotas.length; i++) {
                    if (i == 0) value = '';
                    value += `${i + 1}. ${nombreRol(userData.mascotas[i])} \n`;//`${i + 1}. ${userData.mascotas[i].animal.nombre} (${userData.mascotas[i].animal.calidad.nombre} Lvl: ${calcularNivelMascota(userData.mascotas[i])}) \n`
                }
                if (userData.listo) value += '✅';
                return value;
            }

            await button.message.edit({ embeds: [embed] });
        }
        async function intercambiarMascotas() {
            const mascotas1 = mascotasUser.mascotas.concat(data.user2.mascotas);
            const mascotas2 = mascotasToUser.mascotas.concat(data.user1.mascotas);
            // _probar_
            if (data.user1.mascotas.includes(mascotaEquipada(await findOrCreateDocument(mascotasUser.idDiscord, MascotasData))))
                await desequipar(button.guild, mascotasUser);
            if (data.user2.mascotas.includes(mascotaEquipada(await findOrCreateDocument(mascotasToUser.idDiscord, MascotasData))))
                await desequipar(button.guild, mascotasToUser);

            await MascotasData.updateOne({ idDiscord: mascotasUser.idDiscord }, { mascotas: mascotas1 });
            await MascotasData.updateOne({ idDiscord: mascotasToUser.idDiscord }, { mascotas: mascotas2 });
        }

    } else if (id[1] == 'rechazar' && [id[2], id[3]].includes(button.user.id)) {
        let mens;
        if (id[3] == button.user.id)
            mens = `${button.user.username} ha cancelado el interambio`;
        else
            mens = `${button.user.username} ha rechazado el interambio`;
        await button.message.edit({ embeds: [new MessageEmbed().setTitle(mens).setColor("RED")], components: [] });
        button.deferUpdate();
    } else {
        button.deferUpdate();
    }
}



module.exports = { onClickIntercambio };