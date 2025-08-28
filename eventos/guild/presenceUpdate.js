const { EmbedBuilder } = require("discord.js");
const { GUILD, varOnUpdateMessageEspia, PRIVATE_CONFIG, EVENTOS } = require("../../config/constantes");
const { calcularTiempoToAdd, deepEqual, findOrCreateDocument, add_data, createDataInc } = require("../../handlers/funciones");
const { parseMensajeEspia, bbddVictimas } = require("../../handlers/funcionesVictimas");
const { desequipar, reEquipar } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");
const RecapData = require("../../models/recapData");

module.exports = async (client, oldPresence, newPresence) => {
    if (PRIVATE_CONFIG.ENVIRONMENT === "development") return;
    let member = newPresence?.member || oldPresence?.member;
    if (member?.guild.id != GUILD.SERVER_PLATY) return;

    //-------------------RECAP--------------------
    if (EVENTOS.RECAP_RUNNING) 
        await actualizarTiempos(member, oldPresence, newPresence);
    //--------------------------------------------
    actualizarRolesMascotas(member, oldPresence, newPresence);

    if (varOnUpdateMessageEspia.update != 'Off') {
        bbddVictimas.setArray(parseMensajeEspia(varOnUpdateMessageEspia.update));
        varOnUpdateMessageEspia.setUpdate('Off');
    }

    if (bbddVictimas.arrayVictimas.map(v => v.id).includes(member.id)) {
        let victima = bbddVictimas.arrayVictimas.filter(v => v.id == member.id)[0];
        if (!victima.nombre.startsWith('//'))
            espiarUsuario(member, oldPresence, newPresence, client, victima);
    }
}

async function actualizarTiempos(member, oldPresence, newPresence) {
    if (oldPresence == null || newPresence == null) {
        console.log(`########${member.user.username}########`)
        const recDat = await findOrCreateDocument(member.id, RecapData);
        var data = {
            fechaOnline: null,
            fechaIdle: null,
            fechaDnd: null
        };
        const date = Date.now();

        switch (member.presence.status) {
            case 'online':
                data.fechaOnline = date;
                break;
            case 'idle':
                data.fechaIdle = date;
                break;
            case 'dnd':
                data.fechaDnd = date;
                break;
            case 'offline':
                //NADA
                break;
        }

        const dispositivos = Object.keys(member.presence.clientStatus);

        data = actualizarTiemposMovil(dispositivos, recDat, data, date);

        await RecapData.findOneAndUpdate({ idDiscord: member.id }, data);
        return;
    }

    let onChangeStatus = (oldPresence.status != newPresence.status);
    let onChangeClient = (Object.keys(oldPresence.clientStatus).toString() != Object.keys(newPresence.clientStatus).toString());

    if (onChangeStatus || onChangeClient) {
        console.log(`########${member.user.username}########`)
        const recDat = await findOrCreateDocument(member.id, RecapData);
        const date = Date.now();
        var data = {};
        if (onChangeStatus) {
            data = {
                fechaOnline: null,
                fechaIdle: null,
                fechaDnd: null
            };

            var data_inc = null;
            switch (oldPresence.status) {
                case 'online':
                    var t = calcularTiempoToAdd(date, recDat.fechaOnline);
                    console.log(`Tiempo total ONLINE: ${recDat.tiempoTotalOnline + t}`)
                    data.tiempoTotalOnline = recDat.tiempoTotalOnline + t;
                    data_inc = createDataInc(recDat.fechaOnline, 'online');
                    break;
                case 'idle':
                    var t = calcularTiempoToAdd(date, recDat.fechaIdle);
                    console.log(`Tiempo total IDLE: ${recDat.tiempoTotalIdle + t}`)
                    data.tiempoTotalIdle = recDat.tiempoTotalIdle + t;
                    data_inc = createDataInc(recDat.fechaIdle, 'idle');
                    break;
                case 'dnd':
                    var t = calcularTiempoToAdd(date, recDat.fechaDnd);
                    console.log(`Tiempo total DND: ${recDat.tiempoTotalDnd + t}`)
                    data.tiempoTotalDnd = recDat.tiempoTotalDnd + t;
                    data_inc = createDataInc(recDat.fechaDnd, 'dnd');
                    break;
                case 'offline':
                    //NADA
                    break;
            }
            data = add_data(data, data_inc);
            switch (newPresence.status) {
                case 'online':
                    data.fechaOnline = date;
                    break;
                case 'idle':
                    data.fechaIdle = date;
                    break;
                case 'dnd':
                    data.fechaDnd = date;
                    break;
                case 'offline':
                    //NADA
                    break;
            }
            console.log(`Se actualiza fecha ${newPresence.status.toUpperCase()}: ${date}`)
        }

        if (onChangeClient) {
            const dispositivos = Object.keys(newPresence.clientStatus);
            data = actualizarTiemposMovil(dispositivos, recDat, data, date);
        }

        await RecapData.findOneAndUpdate({ idDiscord: member.id }, data);
    }
}
function actualizarTiemposMovil(dispositivos, recDat, data, date) {
    let enMovil = dispositivos.includes('mobile');
    if (enMovil && recDat.fechaMovil == null) {
        console.log(`Se actualiza fecha Movil: ${date}`)
        data.fechaMovil = date;
    } else if (!enMovil && recDat.fechaMovil != null) {
        var t = calcularTiempoToAdd(date, recDat.fechaMovil)
        console.log(`Tiempo total en MOVIL: ${recDat.tiempoTotalMovil + t}`)
        data.fechaMovil = null;
        data.tiempoTotalMovil = recDat.tiempoTotalMovil + t;

        data = add_data(data, createDataInc(recDat.fechaMovil, 'mobile'))
    }
    return data;
}


function espiarUsuario(member, oldPresence, newPresence, client, victima) {
    if (victima.onlyAvatar) return;
    let detective = client.users.cache.get('431071887372845061');
    const iconUrl = member.user.displayAvatarURL({ format: 'png', size: 4096 });
    var embed = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: iconUrl, url: iconUrl })
        .setColor(victima.color)
        .setFooter({ text: `Cambios en musica: ${victima.musica}` })
        .setTimestamp(new Date());

    var cambioMusica = false;
    let estadoNuevo = newPresence.activities?.filter(a => a.type == 4)[0];
    if (estadoNuevo?.state) embed.setDescription(`${estadoNuevo.emoji?.name ? estadoNuevo.emoji.name + ' ' : ''}` + estadoNuevo.state);


    //Musica
    let spotifyNuevo = newPresence?.activities?.filter(a => a.type == 2)[0];
    let spotifyViejo = oldPresence?.activities?.filter(a => a.type == 2)[0];
    cambioMusica = !deepEqual(spotifyNuevo, spotifyViejo);

    if (spotifyNuevo) {
        embed.addFields({ name: 'Escuchando ', value: `${spotifyNuevo.details} (${spotifyNuevo.state})`, inline: true })
    } else if (cambioMusica) {
        if (spotifyViejo && newPresence.status != 'offline') {
            embed.addFields({ name: 'Deja el Spotify', value: '❌', inline: true })
        }
    }
    //Musica

    if (newPresence.status != 'offline') embed.addFields({ name: 'Clientes', value: Object.keys(newPresence.clientStatus).join(', '), inline: true });
    if (oldPresence == null || newPresence == null) {
        embed.setTitle(`${newPresence.status == 'online' ? '🟢' : newPresence.status == 'idle' ? '🟡' : newPresence.status == 'dnd' ? '🔴' : '☁️'} | Está ${newPresence.status}`)
        return detective.send({ embeds: [embed] });
    }
    if (oldPresence.status != newPresence.status) {
        embed.setTitle(`${newPresence.status == 'online' ? '🟢' : newPresence.status == 'idle' ? '🟡' : newPresence.status == 'dnd' ? '🔴' : '☁️'} | Se ha cambiado a ${newPresence.status}`)
        detective.send({ embeds: [embed] })
    } else {
        if (cambioMusica) {
            if (victima.musica) {
                embed.setTitle(`🔷 | Cambio en música`)
                detective.send({ embeds: [embed] })
            }
        } else {
            embed.setTitle(`🟣 | Cambio de presencia`)
            detective.send({ embeds: [embed] })
        }
    }
}

async function actualizarRolesMascotas(member, oldPresence, newPresence) {
    if ((oldPresence == null || newPresence == null) || (oldPresence.status != newPresence.status)) {
        var userMascotas = (await MascotasData.find({ idDiscord: member.id }))[0];
        if (!userMascotas) return;
        if (member.presence.status == "offline") {
            desequipar(member.guild, userMascotas);
        } else if (oldPresence?.status == "offline" && (oldPresence?.status != newPresence?.status)) {
            reEquipar(userMascotas, member);
        }
    }
}