const { MessageEmbed } = require("discord.js");
const { GUILD, varOnUpdateMessageEspia } = require("../../config/constantes");
const { calcularTiempoToAdd } = require("../../handlers/funciones");
const { desequipar, reEquipar } = require("../../handlers/juegos/funcionesMascotas");
const { MascotasData } = require("../../models/mascotas");
const RecapData = require("../../models/recapData");

function Victima(nombre, id, color, musica) {
    this.nombre = nombre;
    this.id = id;
    this.color = color;
    this.musica = musica;
}
var arrayVictimas = [];

module.exports = async (client, oldPresence, newPresence) => {
    let member = newPresence.member;
    if (member.guild.id != GUILD.SERVER_PLATY) return;

    //-------------------RECAP-------------------- 
    await actualizarTiemposStatus(member, oldPresence, newPresence);
    await actualizarTiemposMovil(member, oldPresence, newPresence);
    //--------------------------------------------
    actualizarRolesMascotas(member, oldPresence, newPresence);

    if (varOnUpdateMessageEspia.update != 'Off') {
        arrayVictimas = parseMensajeEspia(varOnUpdateMessageEspia.update);
        varOnUpdateMessageEspia.setUpdate('Off');        
    }

    if (arrayVictimas.map(v => v.id).includes(member.id)) {
        let victima = arrayVictimas.filter(v => v.id == member.id)[0];
        if (!victima.nombre.startsWith('//'))
            espiarUsuario(member, oldPresence, newPresence, client, victima);
    }
}

async function actualizarTiemposStatus(member, oldPresence, newPresence) {
    if (oldPresence == null || newPresence == null) {
        console.log(`########${member.user.username}########`)
        if (member.presence.status == "online") {
            date = new Date();
            console.log(`Se actualiza fecha ONLINE: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date, fechaDnd: null, fechaIdle: null }, { new: true });
        } else if (member.presence.status == "idle") {
            date = new Date();
            console.log(`Se actualiza fecha IDLE: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date, fechaDnd: null, fechaOnline: null }, { new: true });
        } else if (member.presence.status == "dnd") {
            date = new Date();
            console.log(`Se actualiza fecha DND: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaDnd: date, fechaOnline: null, fechaIdle: null }, { new: true });
        } else {
            console.log('WTF!! 5')
        }
    } else if (oldPresence.status != newPresence.status) {
        console.log(`########${member.user.username}########`)
        const recDat = await RecapData.find({ idDiscord: member.id })
        if (recDat[0] == undefined) {
            const date = new Date();
            console.log("Se crea un documento nuevo")
            switch (member.presence.status) {
                case 'online':
                    await new RecapData({ idDiscord: member.id, fechaOnline: date }).save();
                    break;
                case 'idle':
                    await new RecapData({ idDiscord: member.id, fechaIdle: date }).save();
                    break;
                case 'dnd':
                    await new RecapData({ idDiscord: member.id, fechaDnd: date }).save();
                    break;
                default:
                    await new RecapData({ idDiscord: member.id }).save();
                    break;
            }
            return;
        }
        if (newPresence.status == 'online') {
            date = new Date();
            if (oldPresence.status == 'idle') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaIdle);
                console.log(`Se actualiza fecha ONLINE: ${date}`)
                console.log(`Tiempo total IDLE: ${recDat[0].tiempoTotalIdle + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date, tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
            } else if (oldPresence.status == 'dnd') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaDnd);
                console.log(`Se actualiza fecha ONLINE: ${date}`)
                console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
            } else if (oldPresence.status == 'offline') {
                console.log(`Se actualiza fecha ONLINE: ${date}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date }, { new: true });
            } else {
                console.log('WTFFF 1')
            }
        } else if (newPresence.status == 'idle') {
            date = new Date();
            if (oldPresence.status == 'online') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaOnline);
                console.log(`Se actualiza fecha IDLE: ${date}`);
                console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date, tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
            } else if (oldPresence.status == 'dnd') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaDnd);
                console.log(`Se actualiza fecha IDLE: ${date}`)
                console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
            } else if (oldPresence.status == 'offline') {
                console.log(`Se actualiza fecha IDLE: ${date}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date }, { new: true });
            } else {
                console.log('WTFFF 2')
            }
        } else if (newPresence.status == 'dnd') {
            date = new Date();
            if (oldPresence.status == 'online') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaOnline);
                console.log(`Se actualiza fecha DND: ${date}`)
                console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaDnd: date, tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
            } else if (oldPresence.status == 'idle') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaIdle);
                console.log(`Se actualiza fecha DND: ${date}`)
                console.log(`Tiempo total IDLE: ${recDat[0].tiempoTotalIdle + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaDnd: date, tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
            } else if (oldPresence.status == 'offline') {
                console.log(`Se actualiza fecha DND: ${date}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaDnd: date }, { new: true });
            } else {
                console.log('WTFFF 3')
            }
        } else if (newPresence.status == 'offline') {
            date = new Date();
            if (oldPresence.status == 'online') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaOnline);
                console.log(`Ahora offline`)
                console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
            } else if (oldPresence.status == 'idle') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaIdle);
                console.log(`Ahora offline`)
                console.log(`Tiempo total IDLE: ${recDat[0].tiempoTotalIdle + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
            } else if (oldPresence.status == 'dnd') {
                var t = calcularTiempoToAdd(date, recDat[0].fechaDnd);
                console.log(`Ahora offline`)
                console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
            } else {
                console.log('WTFFF 4')
            }
        }
        //-------------------------------------------
    }
}
async function actualizarTiemposMovil(member, oldPresence, newPresence) {
    if (oldPresence == null || newPresence == null) {
        const dispositivos = Object.keys(member.presence.clientStatus);
        var recDat = await RecapData.find({ idDiscord: member.id })
        date = new Date();
        //arreglado
        if (recDat[0] == undefined) {
            const date = new Date();
            console.log("Se crea un documento nuevo (Por movil)")
            switch (member.presence.status) {
                case 'online':
                    await new RecapData({ idDiscord: member.id, fechaOnline: date }).save();
                    recDat = await RecapData.find({ idDiscord: member.id })
                    break;
                case 'idle':
                    await new RecapData({ idDiscord: member.id, fechaIdle: date }).save();
                    recDat = await RecapData.find({ idDiscord: member.id })
                    break;
                case 'dnd':
                    await new RecapData({ idDiscord: member.id, fechaDnd: date }).save();
                    recDat = await RecapData.find({ idDiscord: member.id })
                    break;
                default:
                    await new RecapData({ idDiscord: member.id }).save();
                    recDat = await RecapData.find({ idDiscord: member.id })
                    break;
            }
        }
        if (dispositivos.includes('mobile') && recDat[0].fechaMovil == null) {
            console.log(`Se actualiza fecha Movil: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaMovil: date }, { new: true });
        } else if (recDat[0].fechaMovil != null) {
            const fechaMovil = new Date(recDat[0].fechaMovil)
            var t = (date - fechaMovil);
            if (t == date.getTime()) {
                t = 0;
                console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
            }
            console.log(`Tiempo total en MOVIL: ${recDat[0].tiempoTotalMovil + t}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaMovil: null, tiempoTotalMovil: recDat[0].tiempoTotalMovil + t }, { new: true });
        }
    } else if (Object.keys(oldPresence.clientStatus).toString() != Object.keys(newPresence.clientStatus).toString()) {
        console.log(`########${member.user.username}########`)
        const dispositivos = Object.keys(newPresence.clientStatus);
        const recDat = await RecapData.find({ idDiscord: member.id })
        date = new Date();
        if (dispositivos.includes('mobile') && recDat[0].fechaMovil == null) {
            console.log(`Se actualiza fecha Movil: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaMovil: date }, { new: true });
        } else if (recDat[0].fechaMovil != null) {
            const fechaMovil = new Date(recDat[0].fechaMovil)
            var t = (date - fechaMovil);
            if (t == date.getTime()) {
                t = 0;
                console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
            }
            console.log(`Tiempo total en MOVIL: ${recDat[0].tiempoTotalMovil + t}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaMovil: null, tiempoTotalMovil: recDat[0].tiempoTotalMovil + t }, { new: true });
        }
    }
}
function espiarUsuario(member, oldPresence, newPresence, client, victima) {
    let detective = client.users.cache.get('431071887372845061');
    const iconUrl = member.user.displayAvatarURL({ format: 'png', size: 4096 });
    var embed = new MessageEmbed()
        .setAuthor({ name: member.user.username, iconURL: iconUrl, url: iconUrl })
        .setColor(victima.color)
        .setFooter({ text: `Cambios en musica: ${victima.musica}` })
        .setTimestamp(new Date());;

    var cambioMusica = false;
    let estadoNuevo = newPresence.activities?.filter(a => a.type == 'CUSTOM')[0];
    if (estadoNuevo?.state) embed.setDescription(estadoNuevo.state);


    //Musica
    let actividadNueva = newPresence?.activities?.filter(a => a.type == 'LISTENING')[0];
    let actividadVieja = oldPresence?.activities?.filter(a => a.type == 'LISTENING')[0];
    cambioMusica = actividadNueva?.syncId != actividadVieja?.syncId;
    if (actividadNueva) {
        embed.addFields({ name: 'Escuchando: ', value: `${actividadNueva.details} (${actividadNueva.state})`, inline: true })
    } else if (cambioMusica) {
        if (actividadVieja && newPresence.status != 'offline') {
            embed.addFields({ name: 'Deja el Spotify', value: '❌', inline: true })
        }
    }
    //Musica

    if (newPresence.status != 'offline') embed.addFields({ name: 'Clientes', value: Object.keys(newPresence.clientStatus).join(', '), inline: true });
    if (oldPresence == null || newPresence == null) {
        embed.setTitle(`${newPresence.status == 'online' ? '🟢' : newPresence.status == 'idle' ? '🟡' : newPresence.status == 'dnd' ? '🔴' : '☁️'} | Está ${newPresence.status}`)
        return detective.send({ embeds: [embed]});
    }
    if (oldPresence.status != newPresence.status) {
        embed.setTitle(`${newPresence.status == 'online' ? '🟢' : newPresence.status == 'idle' ? '🟡' : newPresence.status == 'dnd' ? '🔴' : '☁️'} | Se ha cambiado a ${newPresence.status}`)
        detective.send({ embeds: [embed]})
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
function parseMensajeEspia(mensajeEspia) {
    var arrayVictimas = [];
    mensajeEspia.split('\n').forEach(
        line => {
            const atributos = line.split(':');
            arrayVictimas.push(new Victima(atributos[0], atributos[1], atributos[2], atributos[3] == 'true'));
        });
    return arrayVictimas;
}

async function actualizarRolesMascotas(member, oldPresence, newPresence) {
    if ((oldPresence == null || newPresence == null) || (oldPresence.status != newPresence.status)) {
        var userMascotas = (await MascotasData.find({ idDiscord: member.id }))[0];
        if (!userMascotas) return;
        if (member.presence.status == "offline") {
            desequipar(member.guild, userMascotas);
        } else if (oldPresence?.status == "offline") {
            reEquipar(userMascotas, member);
        }
    }
}