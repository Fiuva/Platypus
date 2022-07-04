const mongoose = require('mongoose');
const { varOnUpdateMessageEspia, CONFIG, GUILD, PRIVATE_CONFIG } = require('../../config/constantes');
const { cambiarEstadoConMensaje, calcularTiempoToAdd } = require('../../handlers/funciones');
const RecapData = require('../../models/recapData');
const schedule = require('node-schedule');
const { funcionStart, MonitorizarTwitch } = require('../../models/monitorizarTwitch');


module.exports = async client => {
    mongoose.connect(PRIVATE_CONFIG.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log(`Conectado a la base de datos`);
        schedule.scheduleJob('0 0 * * *', async () => await recopilarDatosDiarios(client.guilds.cache.get(GUILD.SERVER_PLATY)));
        iniciarMonitorizacionesTwitch(client);
    }).catch((err) => {
        console.log("Error al conectar a la base de datos: " + err);
        client.channels.cache.get('836734022184861706').send('ERROR AL CONECTAR LA BASE DE DATOSSS!!!');
    });
    console.log(`Conectado como ${client.user.tag}`);
    client.channels.cache.get('836734022184861706').send('Bot reiniciado');

    comprobarEstados(await RecapData.find(), client.guilds.cache.get(GUILD.SERVER_PLATY));
    cambiarEstadoConMensaje(client);
    varOnUpdateMessageEspia.setUpdate((await client.channels.cache.get(CONFIG.CANAL_CONFIG).messages.fetch(CONFIG.MENSAJE_ESPIA)).content);
}


async function comprobarEstados(recDat, guild) {
    for (i = 0; i < recDat.length; i++) {
        const id = recDat[i].idDiscord;
        var member = null;
        try {
            member = await guild.members.fetch(id);
        } catch {
            continue;
        }
        const s = member?.presence?.status || 'offline';
        const cs = member?.presence?.clientStatus || null;
        var dispositivos = [];
        if (cs != null) dispositivos = Object.keys(cs);
        const date = new Date();
        if (s == 'online') {
            if (recDat[i].fechaOnline == null) {
                if (recDat[i].fechaDnd != null) {
                    var t = calcularTiempoToAdd(date, recDat[0].fechaDnd);
                    console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                    console.log(`Se actualiza fecha ONLINE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaOnline: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
                } else if (recDat[i].fechaIdle != null) {
                    var t = calcularTiempoToAdd(date, recDat[0].fechaIdle);
                    console.log(`Tiempo total IDLE: ${recDat[0].tiempoTotalIdle + t}`)
                    console.log(`Se actualiza fecha ONLINE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaOnline: date, tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
                } else {
                    console.log(`Se actualiza fecha ONLINE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaOnline: date }, { new: true });
                }
            }
        } else if (s == 'idle') {
            if (recDat[i].fechaIdle == null) {
                if (recDat[i].fechaDnd != null) {
                    var t = calcularTiempoToAdd(date, recDat[0].fechaDnd);
                    console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                    console.log(`Se actualiza fecha IDLE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaIdle: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
                } else if (recDat[i].fechaOnline != null) {
                    var t = calcularTiempoToAdd(date, recDat[0].fechaOnline);
                    console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                    console.log(`Se actualiza fecha IDLE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaIdle: date, tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
                } else {
                    console.log(`Se actualiza fecha IDLE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaIdle: date }, { new: true });
                }
            }
        } else if (s == 'dnd') {
            if (recDat[i].fechaDnd == null) {
                if (recDat[i].fechaIdle != null) {
                    var t = calcularTiempoToAdd(date, recDat[0].fechaIdle);
                    console.log(`Tiempo total DND: ${recDat[0].tiempoTotalIdle + t}`)
                    console.log(`Se actualiza fecha DND: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaDnd: date, tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
                } else if (recDat[i].fechaOnline != null) {
                    var t = calcularTiempoToAdd(date, recDat[0].fechaOnline);
                    console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                    console.log(`Se actualiza fecha Dnd: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaDnd: date, tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
                } else {
                    console.log(`Se actualiza fecha Dnd: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaDnd: date }, { new: true });
                }
            }
        }
        if (dispositivos.includes('mobile') && recDat[i].fechaMovil == null) {
            console.log(`Se actualiza fecha Movil: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: recDat[i].idDiscord }, { fechaMovil: date }, { new: true });
        } else if (recDat[i].fechaMovil != null && !dispositivos.includes('mobile')) {
            const fechaMovil = new Date(recDat[i].fechaMovil)
            console.log(`Tiempo total en MOVIL: ${recDat[i].tiempoTotalMovil + (date - fechaMovil)} ${(member.user.username)}`)
            await RecapData.findOneAndUpdate({ idDiscord: recDat[i].idDiscord }, { fechaMovil: null, tiempoTotalMovil: recDat[i].tiempoTotalMovil + (date - fechaMovil) }, { new: true });
        }
    }
}
async function recopilarDatosDiarios(guild) {
    const recDat = await RecapData.find()
    var i;
    const date = new Date();
    var offset = 0;
    for (i = 0; i < recDat.length; i++) {
        var total;
        var tiempos;
        if (recDat[i].mensajes == undefined) {
            total = 0;
            tiempos = []
        } else {
            total = recDat[i].mensajes.total
            tiempos = recDat[i].mensajes.tiempos
        }
        var mensajesMasFrecuencia = [];
        if (recDat[i].mensajesMasFrecuencia == undefined) {
            mensajesMasFrecuencia = [];
        } else {
            mensajesMasFrecuencia = recDat[i].mensajesMasFrecuencia;
        }
        mensajesMasFrecuencia.push({
            mensajesDia: total,
            date: date,
            tiempoMedio: masFrecuencia(tiempos, 10)
        })
        const mensajes = { total: 0, tiempos: [] }

        var tiempoTotalOnline;
        var tiempoTotalIdle;
        var tiempoTotalDnd;

        if (recDat[i].fechaOnline != null) {
            const fechaOnline = new Date(recDat[i].fechaOnline)
            tiempoTotalOnline = recDat[i].tiempoTotalOnline + (date - fechaOnline)
            tiempoTotalIdle = recDat[i].tiempoTotalIdle
            tiempoTotalDnd = recDat[i].tiempoTotalDnd
        } else if (recDat[i].fechaIdle != null) {
            const fechaIdle = new Date(recDat[i].fechaIdle)
            tiempoTotalOnline = recDat[i].tiempoTotalOnline
            tiempoTotalIdle = recDat[i].tiempoTotalIdle + (date - fechaIdle)
            tiempoTotalDnd = recDat[i].tiempoTotalDnd
        } else if (recDat[i].fechaDnd != null) {
            const fechaDnd = new Date(recDat[i].fechaDnd)
            tiempoTotalOnline = recDat[i].tiempoTotalOnline
            tiempoTotalIdle = recDat[i].tiempoTotalIdle
            tiempoTotalDnd = recDat[i].tiempoTotalDnd + (date - fechaDnd)
        } else {
            tiempoTotalOnline = recDat[i].tiempoTotalOnline
            tiempoTotalIdle = recDat[i].tiempoTotalIdle
            tiempoTotalDnd = recDat[i].tiempoTotalDnd
        }

        const tComienzo = {
            online: tiempoTotalOnline,
            idle: tiempoTotalIdle,
            dnd: tiempoTotalDnd
        }
        var tPorDia = recDat[i].tiemposPorDia;
        const day = date.getDay();
        tPorDia[day] = {
            online: tComienzo.online - recDat[i].tiemposEstadoComienzoDia.online + tPorDia[day].online,
            idle: tComienzo.idle - recDat[i].tiemposEstadoComienzoDia.idle + tPorDia[day].idle,
            dnd: tComienzo.dnd - recDat[i].tiemposEstadoComienzoDia.dnd + tPorDia[day].dnd
        }
        try {
            switch ((await guild.members.fetch(recDat[i].idDiscord)).presence?.status) {
                case 'online':
                    await RecapData.findOneAndUpdate({ idDiscord: recDat[i].idDiscord }, { mensajesMasFrecuencia: mensajesMasFrecuencia, mensajes: mensajes, tiemposEstadoComienzoDia: tComienzo, tiemposPorDia: tPorDia, fechaOnline: date, fechaIdle: null, fechaDnd: null, tiempoTotalOnline: tiempoTotalOnline, tiempoTotalIdle: tiempoTotalIdle, tiempoTotalDnd: tiempoTotalDnd })
                    break;
                case 'idle':
                    await RecapData.findOneAndUpdate({ idDiscord: recDat[i].idDiscord }, { mensajesMasFrecuencia: mensajesMasFrecuencia, mensajes: mensajes, tiemposEstadoComienzoDia: tComienzo, tiemposPorDia: tPorDia, fechaIdle: date, fechaOnline: null, fechaDnd: null, tiempoTotalOnline: tiempoTotalOnline, tiempoTotalIdle: tiempoTotalIdle, tiempoTotalDnd: tiempoTotalDnd })
                    break;
                case 'dnd':
                    await RecapData.findOneAndUpdate({ idDiscord: recDat[i].idDiscord }, { mensajesMasFrecuencia: mensajesMasFrecuencia, mensajes: mensajes, tiemposEstadoComienzoDia: tComienzo, tiemposPorDia: tPorDia, fechaDnd: date, fechaIdle: null, fechaOnline: null, tiempoTotalOnline: tiempoTotalOnline, tiempoTotalIdle: tiempoTotalIdle, tiempoTotalDnd: tiempoTotalDnd })
                    break;
                default:
                    await RecapData.findOneAndUpdate({ idDiscord: recDat[i].idDiscord }, { mensajesMasFrecuencia: mensajesMasFrecuencia, mensajes: mensajes, tiemposEstadoComienzoDia: tComienzo, tiemposPorDia: tPorDia, fechaDnd: null, fechaIdle: null, fechaOnline: null, tiempoTotalOnline: tiempoTotalOnline, tiempoTotalIdle: tiempoTotalIdle, tiempoTotalDnd: tiempoTotalDnd })
                    break;
            }
        } catch {
            offset++;
            console.log(`Usuario no existe | Total: ${offset}`);
        }
    }

    guild.channels.cache.get('836734022184861706').send(`Hoy debería de ser un día nuevo :) || actualizados ${i - offset} documentos (${offset} saltados) `);
    console.log('Esto se debería de enviar cada día a las 00:00 UTC');
}
function masFrecuencia(array, maximo) {
    const dif = [];
    for (var i = 0; i < array.length; i++) {
        if (i == 0) {
            dif.push(null);
        } else {
            var diferencia = array[i] - array[i - 1];
            if (diferencia <= maximo) {
                dif.push(0)
            } else {
                dif.push(diferencia)
            }
        }
    }
    function subsecuenciaCerosMaxima(array) {
        var indexMax = -1;
        var indexPosible = 0;
        var maxLength = 0;
        var posibleLength = 0;
        var noHayCeros = true;
        for (var i = 0; i < array.length; i++) {
            if (array[i] == 0) {
                if (posibleLength == 0) indexPosible = i;
                posibleLength++;
                noHayCeros = false;
            } else {
                posibleLength = 0
            }
            if (array[i + 1] != 0) {
                if (maxLength <= posibleLength && !noHayCeros) {
                    maxLength = posibleLength
                    indexMax = indexPosible
                }
            }
        }
        if (noHayCeros) return [null, null]
        return [indexMax - 1, maxLength + 1]
    }
    function media(array) {
        var sum = 0;
        for (var i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum / array.length
    }
    const res = subsecuenciaCerosMaxima(dif)
    return media(array.splice(res[0], res[1]))
}

async function iniciarMonitorizacionesTwitch(client) {
    let monitorizacion = await MonitorizarTwitch.find({ active: true });
    monitorizacion.forEach(async user => {
        try {
            let member = (await client.guilds.cache.get(GUILD.SERVER_PLATY).members.fetch(user.idDiscord));
            await funcionStart(member, true);
        } catch {
            await MonitorizarTwitch.updateOne({ idDiscord: user.idDiscord }, { active: false });
        }
    })
}