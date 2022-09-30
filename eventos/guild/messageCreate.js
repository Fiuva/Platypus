const { EmbedBuilder, ChannelType } = require("discord.js");
const antiSpam = require("../../config/antiSpam");
const { CANAL_TEXTO, GUILD } = require("../../config/constantes");
const { subirExperiencia, reenviarMensajeTo, findOrCreateDocument } = require("../../handlers/funciones");
const { subirExpMascota, subirExperienciaMascotaPareja } = require("../../handlers/juegos/funcionesMascotas");
const { MonitorizarTwitch, getIDbyName, getToken, mostrarStatsTwitch, funcionStart, funcionStop, calcularPlan, getNamebyID, buscarTwitch } = require("../../models/monitorizarTwitch");
const RecapData = require("../../models/recapData");
const config = require(`${process.cwd()}/config/config.json`);
const talkedRecently = new Set();
const talkedRecently2 = new Set();
var ultimoIdQueHabla = 0;

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.channel?.type == ChannelType.DM) {
        if (message.content.startsWith(config.prefix)) {
            if (talkedRecently2.has(message.author.id))
                return message.reply(`No tan rápido! \nCada comando tiene un cooldown asignado por seguridad`)

            const cmd = message.content.split(" ").shift()?.toLowerCase();
            let member = (await client.guilds.cache.get(GUILD.SERVER_PLATY).members.fetch(message.author.id));
            if (cmd == '!monitorizar') {
                funcionMonitorizar(message, member);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 5000);
            } else if (cmd == '!start') {
                funcionStart(member);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 5000);
            } else if (cmd == '!stop') {
                funcionStop(member);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 5000);
            } else if (cmd == '!delay') {
                funcionCambiarDelay(message, member);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 5000);
            } else if (cmd == '!stats') {
                mostrarStatsTwitch(message);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 5000);
            } else if (cmd == '!eliminar') {
                funcionEliminar(message, member);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 5000);
            } else if (cmd == '!buscar') {
                funcionBuscar(message, member);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 10000);
            } else if (cmd == '!help') {
                funcionHelp(message);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 1000);
            } else if (cmd == '!planes') {
                funcionPlanes(message);
                talkedRecently2.add(message.author.id);
                setTimeout(() => {
                    talkedRecently2.delete(message.author.id);
                }, 1000);
            }
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

    //---------------RECAP------------------
    actualizarMensajesRecap(message) 
    //------------------------------------
    antiSpam.message(message);

    if (!message.content.startsWith(config.prefix)) { //MENSAJES SIN PREFIJO
        //SUBIR EXP -------------------- 
        if (!talkedRecently.has(message.author.id) && message.author.id != ultimoIdQueHabla) {
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

async function funcionMonitorizar(message, member) {
    const args = message.content.trim().split(" ");
    const userTwitch = await findOrCreateDocument(message.author.id, MonitorizarTwitch);
    const plan = await calcularPlan(member, userTwitch);
    var maxUsuarios = 2;
    if (plan == 'Sin Plan') {
        return message.reply(`Necesitas un **plan** activo para monitorizar usuarios __*!planes*__`)
    } else if (plan == 'Tier 1') {
        maxUsuarios = 1;
    } else if (plan == 'Tier 3') {
        maxUsuarios = 5;
    }
    if (message.author.id == "431071887372845061") maxUsuarios = 100;
    if (userTwitch.usuarios.length < maxUsuarios) {
        let id = await getIDbyName(await getToken(), args[1]);
        if (!id) return message.reply(`Usuario inválido`);
        if (args[1].toLowerCase() == "fiuva2" && plan != "Tier 3") {
            return message.reply(`Para monitorizar a Fiuva necesitas ser Tier 3... lo siento :)`)
        }
        if (userTwitch.usuarios.includes(id)) return message.reply(`Ya estás monitorizando a ${args[1]}`);
        let doc = await MonitorizarTwitch.findOneAndUpdate({ idDiscord: userTwitch.idDiscord }, { $push: { usuarios: id } }, { new: true });
        if (userTwitch.active) await funcionStart(member);
        message.reply(`Estás monitorizando a **${args[1]}** \nIDs totales monitorizando: (${doc.usuarios.join(', ')})`);
    } else {
        message.reply(`Ya estás monitorizando al número máximo de usuarios para tu plan (${maxUsuarios}) \n **!planes** para ver los planes \n **!eliminar** para eliminar un usuario`);
    }
}

async function funcionEliminar(message, member) {
    const userTwitch = await findOrCreateDocument(message.author.id, MonitorizarTwitch);
    const args = message.content.trim().split(" ");
    if (userTwitch.usuarios.length == 0) return message.reply(`No tienes usuarios monitorizados`);
    if (args[1] && userTwitch.usuarios.includes(args[1])) {
        const index = userTwitch.usuarios.indexOf(args[1]);
        if (index > -1)
            userTwitch.usuarios.splice(index, 1);
        await MonitorizarTwitch.updateOne({ idDiscord: userTwitch.idDiscord }, { usuarios: userTwitch.usuarios });
        message.reply(`Se ha eliminado el usuario correctamente`);
        if (userTwitch.active) await funcionStart(member);
    } else {
        let token = await getToken();
        var texto = "Para eliminar: !eliminar <ID> \\**!elminar 12345*\\* \n";
        var embed = new EmbedBuilder()
            .setTitle(`!eliminar`)
        for (var i = 0; i < userTwitch.usuarios.length; i++) {
            texto += `ID: **${userTwitch.usuarios[i]}** (${await getNamebyID(token, userTwitch.usuarios[i])}) \n`
        }
        embed.setDescription(texto);
        message.channel.send({ embeds: [embed] });
    }
}

async function funcionCambiarDelay(message, member) {
    const userTwitch = await findOrCreateDocument(message.author.id, MonitorizarTwitch);
    const args = message.content.trim().split(" ");
    if (!args[1]) return message.reply(`El delay actual es de ${userTwitch.delay} min`);
    let delay = parseInt(args[1]);
    if (userTwitch.delay == delay) return message.reply(`El delay ya estaba en ${delay} min`);
    if (!isNaN(delay)) {
        if (delay >= 1) {
            let plan = await calcularPlan(member, userTwitch);
            if (plan == 'Sin Plan') {
                return message.reply(`Necesitas un **plan** activo para monitorizar usuarios __*!planes*__`)
            } else if (plan == 'Tier 1' && delay < 3) {
                return message.reply(`Con tu plan actual \`Tier 1\` el delay no puede ser menor a 3 min`)
            } else if (plan.startsWith('Prueba') && delay < 2) {
                return message.reply(`Con tu plan actual \`Prueba gratis\` el delay no puede ser menor a 2 min`)
            }
            await MonitorizarTwitch.updateOne({ idDiscord: message.author.id }, { delay: delay });
            message.reply(`Ahora la monitorización se actualizará cada ${delay} min`);
            if (userTwitch.active) {
                await funcionStart(member);
            }
        } else {
            message.reply(`Delay invalido`);
        }
    } else {
        message.reply(`Delay invalido`);
    }
}

async function funcionBuscar(message, member) {
    message.reply(`Buscando usuario...`).then(async m => {
        const inicio = Date.now();
        const args = message.content.trim().split(" ");
        const userTwitch = await findOrCreateDocument(member.id, MonitorizarTwitch);
        const plan = await calcularPlan(member, userTwitch);
        if (plan != "Tier 3") return m.edit(`Necesitas ser Tier 3 para usar esta función __*!planes*__`);
        let token = await getToken();
        let id = await getIDbyName(token, args[1]);
        if (!id) return m.edit(`Usuario inválido`);
        await buscarTwitch(args[1], id, m, token, inicio);
    })
}

function funcionHelp(message) {
    const embed = new EmbedBuilder()
        .setTitle(`Monitorizar usuarios de TWITCH`)
        .setColor("DARK_VIVID_PINK")
        .setFooter({ text: `✨Si necesitas más ayuda habla con Fiuva :>` })
        .setDescription(`Los usuarios monitorizados son privados 🕵️`)
        .setFields(
            { name: `!monitorizar`, value: `Monitoriza a un usuario de __twitch__ \nTe llegará una **notificación** mía cuando el usuario **siga o deje de seguir a alguien** y cuando **esté en un directo** de un canal que sigue` },
            { name: `!eliminar`, value: `__Elimina un usuario__ monitorizado` },
            { name: `!delay`, value: `Cambiar la **frecuencia** con la que se comprueban los usuarios (4 min por defecto)` },
            { name: `!start`, value: `**Inicia** o reinicia la monitorización` },
            { name: `!stop`, value: `**Detiene** la monitorización` },
            { name: `!stats`, value: `Muestra algunas **estadísticas** de los usuarios monitorizados` },
            { name: `!buscar`, value: `*Solo para Tier 3* \nMuestra los canales que ve cualquier usuario de twitch en ese instante \n\`!buscar pepe\`` },
            { name: `!planes`, value: `Aqui puedes **ver los planes disponibles** :>` },
        )

    message.reply({ embeds: [embed] });
}

function funcionPlanes(message) {
    const embed = new EmbedBuilder()
        .setTitle(`Planes`)
        .setDescription(`Para acceder a algún plan solo tienes que __suscribirte__ (es **gratis con Amazon Prime**) al canal de twitch.tv/fiuva2 y vincular tu cuenta de twitch en discord`)
        .setColor("Orange")
        .setAuthor({ name: `Fiuva2`, url: `https://twitch.tv/fiuva2` })
        .setFooter({ text: `✨Oferta 50% y más planes con pagos vía PayPal (habla con Fiuva)` })
        .setFields(
            { name: `Prueba gratis`, value: `Delay mínimo permitido: **2 min** \nUsuarios máximos monitorizados: **2**` },
            { name: `Tier 1 | Prime`, value: `Delay mínimo permitido: **3 min** \nUsuarios máximos monitorizados: **1**` },
            { name: `Tier 2`, value: `Delay mínimo permitido: **1 min** \nUsuarios máximos monitorizados: **2**` },
            { name: `Tier 3`, value: `Delay mínimo permitido: **1 min** \nUsuarios máximos monitorizados: **5** \nDisponible el comando **!buscar**` },
        )

    message.reply({ embeds: [embed] });
}