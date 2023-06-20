const mongoose = require('mongoose');
const { varOnUpdateMessageEspia, CONFIG, GUILD, PRIVATE_CONFIG, CANAL_TEXTO } = require('../../config/constantes');
const { cambiarEstadoConMensaje, calcularTiempoToAdd, add_data, createDataInc } = require('../../handlers/funciones');
const RecapData = require('../../models/recapData');
const schedule = require('node-schedule');
const { funcionStart, MonitorizarTwitch } = require('../../models/monitorizarTwitch');
const diainternacionalde = require('../../models/diainternacionalde');
const express = require('express');
const http = require('http');


module.exports = async client => {
    //CREAR COMANDOS (/) ---
    client.application.commands.set(client.commands.filter(comando => "data" in comando).map(c => c.data)).then().catch(console.error);
    // -----------------
    const guild = client.guilds.cache.get(GUILD.SERVER_PLATY);

    mongoose.set('strictQuery', false); //Para quitar el warning del futuro cambio a eso (comprobar este cambio)
    mongoose.connect(PRIVATE_CONFIG.MONGODB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log(`Conectado a la base de datos`);
        const rule = new schedule.RecurrenceRule();
        rule.hour = 0;
        rule.minute = 0;
        rule.tz = 'Europe/Madrid';
        schedule.scheduleJob(rule, async () => {
            const did = await diainternacionalde.getCategorizedResults();
            client.channels.cache.get(CANAL_TEXTO.ANUNCIOS).send(diainternacionalde.getMessageDataActual(did));
        });
        schedule.scheduleJob('0 0 * * *', async () => await recopilarDatosDiarios(guild));
        iniciarMonitorizacionesTwitch(client);
    }).catch((err) => {
        console.log("Error al conectar a la base de datos: " + err);
        client.channels.cache.get(CANAL_TEXTO.PRIVATE_PRUEBAS).send('ERROR AL CONECTAR LA BASE DE DATOSSS!!!');
    });
    console.log(`Conectado como ${client.user.tag}`);
    client.channels.cache.get(CANAL_TEXTO.PRIVATE_PRUEBAS).send('Bot reiniciado');

    comprobarEstados(guild);
    cambiarEstadoConMensaje(client);
    varOnUpdateMessageEspia.setUpdate((await client.channels.cache.get(CONFIG.CANAL_CONFIG).messages.fetch(CONFIG.MENSAJE_ESPIA)).content);

    const server = http.createServer(async (req, res) => {
        if (req.url === '/api/actual') {
            //const data = await getCategorizedResultsWithDate();
            const messageData = {hola: "aaa"};

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(messageData));
        } else if (req.url.startsWith('/api/custom/')) {
            const [_, mes, dia] = req.url.split('/');
            //const data = await getCategorizedResultsWithDate(mes, dia);
            const messageData = { hola: "eeee"+mes };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(messageData));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
        }
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`API server listening on port ${port}`);
    });
}

async function comprobarEstados(guild) {
    let allData = await RecapData.find()
    allData.forEach(async recDat => {
        const id = recDat.idDiscord;
        var member = guild.members.cache.get(id);
        if (!member) {
            try {
                member = await guild.members.fetch(id);
            } catch {
                return;
            }
        }

        const s = member?.presence?.status || 'offline';
        const cs = member?.presence?.clientStatus || null;
        var dispositivos = [];
        if (cs != null) dispositivos = Object.keys(cs);
        const date = Date.now();

        var data = {}
        var data_inc = null;

        if (s == 'online' && recDat.fechaOnline == null) {
            console.log(`Se actualiza fecha ONLINE: ${date}`)
            data.fechaOnline = date;
            if (recDat.fechaDnd != null) {
                var t = calcularTiempoToAdd(date, recDat.fechaDnd);
                console.log(`Tiempo total DND: ${recDat.tiempoTotalDnd + t}`)
                data.tiempoTotalDnd = recDat.tiempoTotalDnd + t;
                data.fechaDnd = null;
                data_inc = createDataInc(recDat.fechaDnd, 'dnd');
            } else if (recDat.fechaIdle != null) {
                var t = calcularTiempoToAdd(date, recDat.fechaIdle);
                console.log(`Tiempo total IDLE: ${recDat.tiempoTotalIdle + t}`)
                data.tiempoTotalIdle = recDat.tiempoTotalIdle + t;
                data.fechaIdle = null;
                data_inc = createDataInc(recDat.fechaIdle, 'idle');
            }
        } else if (s == 'idle' && recDat.fechaIdle == null) {
            console.log(`Se actualiza fecha IDLE: ${date}`)
            data.fechaIdle = date;
            if (recDat.fechaDnd != null) {
                var t = calcularTiempoToAdd(date, recDat.fechaDnd);
                console.log(`Tiempo total DND: ${recDat.tiempoTotalDnd + t}`)
                data.tiempoTotalDnd = recDat.tiempoTotalDnd + t;
                data.fechaDnd = null;
                data_inc = createDataInc(recDat.fechaDnd, 'dnd');
            } else if (recDat.fechaOnline != null) {
                var t = calcularTiempoToAdd(date, recDat.fechaOnline);
                console.log(`Tiempo total ONLINE: ${recDat.tiempoTotalOnline + t}`)
                data.tiempoTotalOnline = recDat.tiempoTotalOnline + t;
                data.fechaOnline = null;
                data_inc = createDataInc(recDat.fechaOnline, 'online');
            }
        } else if (s == 'dnd' && recDat.fechaDnd == null) {
            console.log(`Se actualiza fecha DND: ${date}`)
            data.fechaDnd = date;
            if (recDat.fechaIdle != null) {
                var t = calcularTiempoToAdd(date, recDat.fechaIdle);
                console.log(`Tiempo total IDLE: ${recDat.tiempoTotalIdle + t}`)
                data.tiempoTotalIdle = recDat.tiempoTotalIdle + t;
                data.fechaIdle = null;
                data_inc = createDataInc(recDat.fechaIdle, 'idle');
            } else if (recDat.fechaOnline != null) {
                var t = calcularTiempoToAdd(date, recDat.fechaOnline);
                console.log(`Tiempo total ONLINE: ${recDat.tiempoTotalOnline + t}`)
                data.tiempoTotalOnline = recDat.tiempoTotalOnline + t;
                data.fechaOnline = null;
                data_inc = createDataInc(recDat.fechaOnline, 'online');
            }
        }
        data = add_data(data, data_inc);

        let enMovil = dispositivos.includes('mobile');
        if (enMovil && recDat.fechaMovil == null) {
            console.log(`Se actualiza fecha Movil: ${date}`)
            data.fechaMovil = date;
        } else if (!enMovil && recDat.fechaMovil != null) {
            var t = calcularTiempoToAdd(date, recDat.fechaMovil)
            console.log(`Tiempo total en MOVIL: ${recDat.tiempoTotalMovil + t}`)
            data.fechaMovil = null;
            data.tiempoTotalMovil = recDat.tiempoTotalMovil + t;
            data_inc = createDataInc(recDat.fechaMovil, 'mobile');
        }
        data = add_data(data, data_inc);

        if (Object.keys(data).length != 0)
            await RecapData.findOneAndUpdate({ idDiscord: id }, data);

    });
}
async function recopilarDatosDiarios(guild) {
    const allData = await RecapData.find()
    const date = new Date();
    guild.channels.cache.get('836734022184861706').send(`Hoy debería de ser un día nuevo :)`);
    allData.forEach(async recDat => {
        let total = 0;
        let tiempos = [];
        if (recDat.mensajes !== undefined) {
            total = recDat.mensajes.total;
            tiempos = recDat.mensajes.tiempos;
        }
        const mensajesMasFrecuencia = recDat.mensajesMasFrecuencia || [];
        mensajesMasFrecuencia.push({
            mensajesDia: total,
            date: date,
            tiempoMedio: masFrecuencia(tiempos, 10),
        });
        const mensajes = { total: 0, tiempos: [] };

        try {
            const member = await guild.members.fetch(recDat.idDiscord);
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { mensajesMasFrecuencia, mensajes });
        } catch {
            console.log(`No encontrado`);
        }
    });
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
        if (array.length == 0) {
            return NaN;
        }
        return array.reduce((a, b) => a + b) / array.length;
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