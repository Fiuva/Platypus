const { EmbedBuilder, ChannelType } = require("discord.js");
const antiSpam = require("../../config/antiSpam");
const { CANAL_TEXTO, GUILD, EVENTOS, PRIVATE_CONFIG } = require("../../config/constantes");
const { subirExperiencia, reenviarMensajeTo, findOrCreateDocument, createRegaloRandom } = require("../../handlers/funciones");
const { subirExpMascota, subirExperienciaMascotaPareja } = require("../../handlers/juegos/funcionesMascotas");
const RecapData = require("../../models/recapData");
const config = require(`${process.cwd()}/config/config.json`);
const talkedRecently = new Set();
const talkedRecently2 = new Set();
var ultimoIdQueHabla = 0;
const gemini = require('../../models/Gemini');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel?.type == ChannelType.DM) {
        if (message.content.startsWith(config.prefix)) {
            // if (talkedRecently2.has(message.author.id))
            //     return message.reply(`No tan rápido! \nCada comando tiene un cooldown asignado por seguridad`)

            // const cmd = message.content.split(" ").shift()?.toLowerCase();
            // let member = (await client.guilds.cache.get(GUILD.SERVER_PLATY).members.fetch(message.author.id));
            // if (cmd == '!hola') {
            //     talkedRecently2.add(message.author.id);
            //     setTimeout(() => {
            //         talkedRecently2.delete(message.author.id);
            //     }, 5000);
            // } 
        }
        reenviarMensajeTo(message, client.channels.cache.get(CANAL_TEXTO.PRIVATE_MDS), true);
        return;
    }

    if (message.guild?.id != GUILD.SERVER_PLATY) return;
    if (message.channel.id == CANAL_TEXTO.PRIVATE_MDS) {
        if (message.reference) {
            const mens = await message.channel.messages.fetch(message.reference.messageId)
            const to = mens.mentions.members.first();
            if (!to) return message.reply('Tienes que responder a alguna mención :<');
            try {
                await reenviarMensajeTo(message, to).then(message.react('✅'));
            } catch {
                message.reply('No se ha podido enviar el mensaje :<')
            }
        } else if (message.reference == null) {
            message.reply('No has respondido a nadie')
        }
        return;
    }
    if (message.channel.id == CANAL_TEXTO.PRIVATE_ENVIAR) {
        if (message.content.startsWith('<#')) {
            const id = message.content.split('<')[1].split('>')[0].replace('#', '');
            message.content = message.content.split(`#${id}>`)[1];
            client.channels.fetch(id).then(channel => {
                reenviarMensajeTo(message, channel);
                message.react('✅');
            }).catch(e => {
                message.react('❌')
            });
        } else {
            message.channel.send('Para enviar un mensaje a un canal primero pon el canal \"#general hola\"')
        }
        return;
    }

    // Si menciona al bot
    if (message.mentions.has(client.user.id)) {
        message.channel.sendTyping();
        gemini.send(`${message.author.username} dice: \"${message.content}\"`).then(res => {
            message.reply(res);
        }).catch(e => {
            console.log(e);
            message.reply('No puedo responder a eso :<');
        });
    }

    if (PRIVATE_CONFIG.ENVIRONMENT == "development" && message.channel.id != CANAL_TEXTO.GENERAL) return;

    //---------------RECAP------------------
    if (EVENTOS.RECAP_RUNNING) 
        actualizarMensajesRecap(message) 
    //------------------------------------
    antiSpam.message(message);

    if (message.channel.id == CANAL_TEXTO.CARCEL) return;
    if (!message.content.startsWith(config.prefix)) { //MENSAJES SIN PREFIJO
        //SUBIR EXP -------------------- 
        if (!talkedRecently.has(message.author.id) && message.author.id != ultimoIdQueHabla) {
            if (EVENTOS.NAVIDAD) {
                if (Math.random() < 0.05) {
                    const [embed, components] = createRegaloRandom();
                    message.channel.send({ embeds: [embed], components: [components] });
                }
            }
            ultimoIdQueHabla = message.author.id;
            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, 5000);
            subirExperiencia(message);
            //------------
            subirExpMascota(message);
            subirExperienciaMascotaPareja(message);
            //------------
        }
        // -----------------------------
    } else {
        const args = message.content.slice(config.prefix.length).trim().split(" ");
        const cmd = args.shift()?.toLowerCase();
        command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));
        if (command) {
            if (command.canales && !command.canales?.includes(message.channel.id)) return;
            if (command.roles && !command.roles?.some(r => message.member.roles.cache.map(r => r.id).includes(r)))
                return message.reply('No tienes autorización para hacer eso');

            if ("data" in command)
                return message.reply({ content: 'Ahora los comandos son con "/"', ephemeral: true });
            command.run(client, message, args);
        } else {
            return console.log("No existe este comando")
        }
    }
}


async function actualizarMensajesRecap(message) {
    const date = new Date();
    const recDat = await RecapData.find({ idDiscord: message.author.id })
    if (recDat[0] == undefined) {
        var tiempos = [];
        tiempos.push(date.getHours() * 60 + date.getMinutes());
        const mensajes = { total: 1, tiempos: tiempos }
        console.log("Se crea un documento nuevo")
        if (!message.member.presence) return await new RecapData({ idDiscord: message.author.id, mensajes: mensajes }).save();
        switch (message.member.presence.status) {
            case 'online':
                await new RecapData({ idDiscord: message.author.id, fechaOnline: date, mensajes: mensajes }).save();
                break;
            case 'idle':
                await new RecapData({ idDiscord: message.author.id, fechaIdle: date, mensajes: mensajes }).save();
                break;
            case 'dnd':
                await new RecapData({ idDiscord: message.author.id, fechaDnd: date, mensajes: mensajes }).save();
                break;
            default:
                await new RecapData({ idDiscord: message.author.id, mensajes: mensajes }).save();
                break;
        }
        return
    }
    var total;
    var tiempos;
    if (recDat[0].mensajes == undefined) {
        total = 0;
        tiempos = []
    } else {
        total = recDat[0].mensajes.total
        tiempos = recDat[0].mensajes.tiempos
    }
    total++;
    tiempos.push(date.getHours() * 60 + date.getMinutes());
    const mensajes = { total: total, tiempos: tiempos }
    await RecapData.findOneAndUpdate({ idDiscord: message.author.id }, { mensajes: mensajes })
}