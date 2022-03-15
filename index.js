const Discord = require('discord.js');
require('discord-reply')
const client = new Discord.Client({ partials: ["REACTION", "MESSAGE", "USER"] });
require('discord-buttons')(client);
const disbut = require('discord-buttons');

client.login(process.env.token);


const mongoose = require('mongoose');
const user = 'prueba';
const password = process.env.password;
const dbname = 'Platypus'
const uri = `mongodb+srv://${user}:${password}@cluster0.mc7yn.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true/*, useCreateIndex: true, useFindAndModify: false */}
)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log(e));

const express = require('express');
const Usuario = require('./models/usuario');
const RecapData = require('./models/recapData');

const router = express.Router();

var date = new Date();
const nExp = 1;
const aumentaNivel = 7;
const aumentaMonedas = 25;
const precioAnillo = 30;
const precioMillonario = 2000;

module.exports = { client };

const Canvas = require('canvas');
Canvas.registerFont("./Fonts/Impacted.ttf", { family: "Impacted" });
const { findOneAndUpdate, count } = require('./models/usuario');

var math = require('mathjs');
const antiSpam = require('./antiSpam');

const nombreMonedas = 'PlatyCoins';
const idMillonario = '836992600979669057';
const idMod = '836950934806069299';
const idAdmin = '836950360782143529';
const idMaltratador = '837016264421408850';
const idBrawlStars = '836877776422305822';
const idSub = '837346304517865532';

const guildServerPlaty = "836721843955040337";
const idCanalesMusica = {
    platy: "838776417768046622",
    otro: "953350044982079561"
}
const voiceCId = '836957406599577631';
const idVDuo = '836991033208078428';
const idVTrio = '836991104754253836';
const idVCuarteto = '836991178717134877';
const idVQuinteto = '836991212124241941';
const talkedRecently = new Set();

const schedule = require('node-schedule');
function masFrecuencia(array, maximo) {
    const dif = [];
    for (i = 0; i < array.length; i++) {
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
        for (i = 0; i < array.length; i++) {
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
        for (i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum / array.length
    }
    const res = subsecuenciaCerosMaxima(dif)
    return media(array.splice(res[0], res[1]))
}
const job = schedule.scheduleJob('0 0 * * *', async function () {
    const recDat = await RecapData.find()
    var i;
    const date = new Date();
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
        switch ((await client.users.fetch(recDat[i].idDiscord)).presence.status) {
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
    }

    client.channels.cache.get('836734022184861706').send('Hoy debería de ser un día nuevo, esto es una prueba, no se asusten :)' + ` || actualizados ${i} documentos (espero que no haya petado mi base de datos xd)`);
    console.log('Esto se debería de enviar cada día a las 00:00');
});

client.on('ready', async () => {
    console.log(`Bot is ready as: ${client.user.tag}`);

    //------------------------------
    const recDat = await RecapData.find()
    for (i = 0; i < recDat.length; i++) {
        const id = recDat[i].idDiscord
        const s = (await client.users.fetch(id)).presence.status
        const cs = (await client.users.fetch(id)).presence.clientStatus
        var dispositivos = [];
        if(cs != null && cs != undefined) dispositivos = Object.keys(cs); 
        const date = new Date();
        if (s == 'online') {
            if (recDat[i].fechaOnline == null) {
                if (recDat[i].fechaDnd != null) {
                    const fechaDnd = new Date(recDat[0].fechaDnd)
                    var t = (date - fechaDnd);
                    if (t == date.getTime()) {
                        t = 0;
                        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    }
                    console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                    console.log(`Se actualiza fecha ONLINE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaOnline: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
                } else if (recDat[i].fechaIdle != null) {
                    const fechaIdle = new Date(recDat[0].fechaIdle)
                    var t = (date - fechaIdle);
                    if (t == date.getTime()) {
                        t = 0;
                        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    }
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
                    const fechaDnd = new Date(recDat[0].fechaDnd)
                    var t = (date - fechaDnd);
                    if (t == date.getTime()) {
                        t = 0;
                        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    }
                    console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                    console.log(`Se actualiza fecha IDLE: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaIdle: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
                } else if (recDat[i].fechaOnline != null) {
                    const fechaOnline = new Date(recDat[0].fechaOnline)
                    var t = (date - fechaOnline);
                    if (t == date.getTime()) {
                        t = 0;
                        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    }
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
                    const fechaIdle = new Date(recDat[0].fechaIdle)
                    var t = (date - fechaIdle);
                    if (t == date.getTime()) {
                        t = 0;
                        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    }
                    console.log(`Tiempo total DND: ${recDat[0].tiempoTotalIdle + t}`)
                    console.log(`Se actualiza fecha DND: ${date}`)
                    await RecapData.findOneAndUpdate({ idDiscord: id }, { fechaDnd: date, tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
                } else if (recDat[i].fechaOnline != null) {
                    const fechaOnline = new Date(recDat[0].fechaOnline)
                    var t = (date - fechaOnline);
                    if (t == date.getTime()) {
                        t = 0;
                        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                    }
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
            console.log(`Tiempo total en MOVIL: ${recDat[i].tiempoTotalMovil + (date - fechaMovil)} ${(await client.users.fetch(recDat[i].idDiscord)).username}`)
            await RecapData.findOneAndUpdate({ idDiscord: recDat[i].idDiscord }, { fechaMovil: null, tiempoTotalMovil: recDat[i].tiempoTotalMovil + (date - fechaMovil) }, { new: true });
        }
    }
    //------------------------------
    /*
    const fecha = new Date('2021-05-21T14:35:00');
    var func = function () {
        return function () {
            var diferencia = new Date(fecha.getTime() - new Date().getTime())
            if (diferencia.getTime() < 0) {
                client.user.setPresence({
                    activity: {
                        name: '1 año lol',
                        type: 'WATCHING',
                    }
                })
                return
            }
            var mensaje = ((diferencia.getDate() - 1) > 0 ? diferencia.getDate() - 1 + ', ' : '') + (diferencia.getHours()) + ':' + (diferencia.getMinutes()) + ':' + ((diferencia.getSeconds()) < 10 ? '0' : '') + (diferencia.getSeconds());
            setTimeout(func(), 5000);
            client.user.setPresence({
                activity: {
                    name: mensaje,
                    type: 'WATCHING',
                }
            })
        }
    }
    setTimeout(func(), 5000);
    */

    client.channels.cache.get('836734022184861706').send('Bot reiniciado');
    cambiarEstadoConMensaje()
})
client.on('messageUpdate', (oldMessage, newMessage) => {
    if (oldMessage.id != '849734239305334834' && oldMessage.id != '902653657089183744') return
    if (newMessage != oldMessage) {
        if (oldMessage.id == '849734239305334834') {
            cambiarEstadoConMensaje()
        } else if (oldMessage.id == '902653657089183744') {
            client.user.setAvatar(newMessage.content);
        }
    } 
})

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.channel;
    let oldUserChannel = oldMember.channel;
    if (oldUserChannel != newUserChannel) {
        if (oldUserChannel == undefined && newUserChannel != undefined) {
            //ENTRAR (a newUserChannel)
            crearCanalDeVoz(newUserChannel.id);
        } else if (newUserChannel == undefined) {
            //SALIR (de oldUserChannel)
            eliminarCanalDeVoz(oldUserChannel);
            if (oldUserChannel.members.size == 1 && oldUserChannel.members.first().id == '836972868055203850' && (oldUserChannel.id == idCanalesMusica.platy || oldUserChannel.id == idCanalesMusica.otro)) {
                queue.delete(oldUserChannel.guild.id);
                client.channels.cache.get(oldUserChannel.id).leave();
                return;
            }
        } else {
            //CAMBIAR (de oldUserChannel a newUserChannel)
            crearCanalDeVoz(newUserChannel.id);
            eliminarCanalDeVoz(oldUserChannel);
            if (oldUserChannel.members.size == 1 && oldUserChannel.members.first().id == '836972868055203850' && (oldUserChannel.id == idCanalesMusica.platy || oldUserChannel.id == idCanalesMusica.otro)) {
                queue.delete(oldUserChannel.guild.id);
                client.channels.cache.get(oldUserChannel.id).leave();
                return;
            }
        }
    }

    function crearCanalDeVoz(idCanalEntrante) {
        if (idCanalEntrante != idVDuo && idCanalEntrante != idVTrio && idCanalEntrante != idVCuarteto && idCanalEntrante != idVQuinteto) return;
        var nombreNuevoCanal;
        var limiteUsuarios;
        switch (idCanalEntrante) {
            case idVDuo:
                nombreNuevoCanal = "D\u00fao de " + newMember.member.user.username;
                limiteUsuarios = 2;
                break;
            case idVTrio:
                nombreNuevoCanal = "Tr\u00edo de " + newMember.member.user.username;
                limiteUsuarios = 3;
                break;
            case idVCuarteto:
                nombreNuevoCanal = "Squad de " + newMember.member.user.username;
                limiteUsuarios = 4;
                break;
            case idVQuinteto:
                nombreNuevoCanal = "Quinteto de " + newMember.member.user.username;
                limiteUsuarios = 5;
                break;
        }
        newMember.guild.channels.create(nombreNuevoCanal, {
            type: 'voice'
        }).then((channel) => {
            channel.setParent(voiceCId);
            channel.setUserLimit(limiteUsuarios);
            newMember.setChannel(channel);
        })
    }
    function eliminarCanalDeVoz(CanalSaliente) {
        if (!CanalSaliente.name.startsWith("D\u00fao de ") && !CanalSaliente.name.startsWith("Tr\u00edo de ") && !CanalSaliente.name.startsWith("Squad de ") && !CanalSaliente.name.startsWith("Quinteto de ")) return;
        if (CanalSaliente.members.size == 0) {
            CanalSaliente.delete();
        }
    }
})

client.on('guildMemberAdd', member => {
    if (member.guild.id != guildServerPlaty) return;
    ; (async () => {
        member.guild.channels.cache.get("837367366227853423").setName('Ornitorrincos: ' + member.guild.memberCount);
        const canvas = Canvas.createCanvas(1600, 814);
        const ctx = canvas.getContext('2d');
        const background = await Canvas.loadImage('./platyWall.jpg');
        let x = 0;
        let y = 0;
        ctx.drawImage(background, x, y);

        ctx.font = '125px "Impacted"';
        //Rectangulo letras____________________________
        ctx.fillStyle = '#00000088';
        //ctx.fillRect(0, 320, 135 + ctx.measureText(member.user.username).width, 165); //730 + message.author.username.length * 53.5
        //_____________________________________________0 320 1000 165
        ctx.fillStyle = '#000000';
        ctx.fillText(`${member.user.username}!`, 50, 275);
        ctx.fillText(`Bienvenido`, 50, 135);
        ctx.fillStyle = '#ECCCFF';
        ctx.fillText(`${member.user.username}!`, 65, 265);
        ctx.fillText(`Bienvenido`, 65, 125);

        ctx.beginPath();
        ctx.arc(1380, 595, 200, 0, Math.PI * 2, true); //1700, 250, 250
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 1215, 430, 330, 330); //1500, 50, 400, 400

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'imagenDeBienvenida.png');
        member.guild.channels.cache.get("836730119023493140").send(`**Bienvenid@ ${member.user}, que lo pases bien!** 🤤`, attachment);
    })()
})
client.on('guildMemberRemove', async member => {
    if (member.guild.id != guildServerPlaty) return;
    member.guild.channels.cache.get("837367366227853423").setName('Ornitorrincos: ' + member.guild.memberCount);
    member.guild.channels.cache.get("836730119023493140").send(`${member.user} ha abandonado la familia de ornitorrincos :'<`);
    var recDat = await RecapData.find({ idDiscord: member.id })
    if (recDat[0] != undefined) {
        await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaMovil: null, fechaDnd: null, fechaOnline: null, fechaIdle: null }, { new: true });
        console.log(`Alguien salió, se modifica su documento de ${member.id}`)
    }
})
client.on('messageReactionAdd', (reaction, user) => {
    let emoji = reaction.emoji;
    if (reaction.message.id == '837347810705539173') {
        if (emoji.name == '⭐') {
            reaction.message.guild.members.cache.get(user.id).roles.add(idBrawlStars);
        } else if (emoji.name == '💥') {
            reaction.message.guild.members.cache.get(user.id).roles.add(idSub);
        } else {
            reaction.remove(user);
        }
    }
})
client.on('presenceUpdate', async (oldPresence, newPresence) => {
    let member = newPresence.member;
    if (member.guild.id != guildServerPlaty) return;

    //-------------------------------------------
    if (oldPresence == null || newPresence == null) {
        console.log(`########${member.user.username}########`)
        if (member.user.presence.status == "online") {
            date = new Date();
            console.log(`Se actualiza fecha ONLINE: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date, fechaDnd: null, fechaIdle: null }, { new: true });
        } else if (member.user.presence.status == "idle") {
            date = new Date();
            console.log(`Se actualiza fecha IDLE: ${date}`)
            await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date, fechaDnd: null, fechaOnline: null }, { new: true });
        } else if (member.user.presence.status == "dnd") {
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
            switch (member.user.presence.status) {
                case 'online':
                    await new RecapData({ idDiscord: member.id, fechaOnline: date }).save().then();
                    break;
                case 'idle':
                    await new RecapData({ idDiscord: member.id, fechaIdle: date }).save().then();
                    break;
                case 'dnd':
                    await new RecapData({ idDiscord: member.id, fechaDnd: date }).save().then();
                    break;
                default:
                    await new RecapData({ idDiscord: member.id }).save().then();
                    break;
            }
            return
        }
        if (newPresence.status == 'online') {
            date = new Date();
            if (oldPresence.status == 'idle') {
                const fechaIdle = new Date(recDat[0].fechaIdle)
                console.log(`Se actualiza fecha ONLINE: ${date}`)
                var t = (date - fechaIdle);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total IDLE: ${recDat[0].tiempoTotalIdle + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date, tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
            } else if (oldPresence.status == 'dnd') {
                const fechaDnd = new Date(recDat[0].fechaDnd)
                console.log(`Se actualiza fecha ONLINE: ${date}`)
                var t = (date - fechaDnd);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
            } else if (oldPresence.status == 'offline') {
                console.log(`Se actualiza fecha ONLINE: ${date}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaOnline: date }, { new: true });
            } else {
                consol.log('WTFFF 1')
            }
        } else if (newPresence.status == 'idle') {
            date = new Date();
            if (oldPresence.status == 'online') {
                const fechaOnline = new Date(recDat[0].fechaOnline)
                console.log(`Se actualiza fecha IDLE: ${date}`)
                var t = (date - fechaOnline);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date, tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
            } else if (oldPresence.status == 'dnd') {
                const fechaDnd = new Date(recDat[0].fechaDnd)
                console.log(`Se actualiza fecha IDLE: ${date}`)
                var t = (date - fechaDnd);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date, tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
            } else if (oldPresence.status == 'offline') {
                console.log(`Se actualiza fecha IDLE: ${date}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaIdle: date }, { new: true });
            } else {
                consol.log('WTFFF 2')
            }
        } else if (newPresence.status == 'dnd') {
            date = new Date();
            if (oldPresence.status == 'online') {
                const fechaOnline = new Date(recDat[0].fechaOnline)
                console.log(`Se actualiza fecha DND: ${date}`)
                var t = (date - fechaOnline);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaDnd: date, tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
            } else if (oldPresence.status == 'idle') {
                const fechaIdle = new Date(recDat[0].fechaIdle)
                console.log(`Se actualiza fecha DND: ${date}`)
                var t = (date - fechaIdle);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total IDLE: ${recDat[0].tiempoTotalIdle + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaDnd: date, tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
            } else if (oldPresence.status == 'offline') {
                console.log(`Se actualiza fecha DND: ${date}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { fechaDnd: date }, { new: true });
            } else {
                consol.log('WTFFF 3')
            }
        } else if (newPresence.status == 'offline') {
            date = new Date();
            if (oldPresence.status == 'online') {
                const fechaOnline = new Date(recDat[0].fechaOnline)
                console.log(`Ahora offline`)
                var t = (date - fechaOnline);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total ONLINE: ${recDat[0].tiempoTotalOnline + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { tiempoTotalOnline: recDat[0].tiempoTotalOnline + t, fechaOnline: null }, { new: true });
            } else if (oldPresence.status == 'idle') {
                const fechaIdle = new Date(recDat[0].fechaIdle)
                console.log(`Ahora offline`)
                var t = (date - fechaIdle);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total IDLE: ${recDat[0].tiempoTotalIdle + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { tiempoTotalIdle: recDat[0].tiempoTotalIdle + t, fechaIdle: null }, { new: true });
            } else if (oldPresence.status == 'dnd') {
                const fechaDnd = new Date(recDat[0].fechaDnd)
                console.log(`Ahora offline`)
                var t = (date - fechaDnd);
                if (t == date.getTime()) {
                    t = 0;
                    console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
                }
                console.log(`Tiempo total DND: ${recDat[0].tiempoTotalDnd + t}`)
                await RecapData.findOneAndUpdate({ idDiscord: member.id }, { tiempoTotalDnd: recDat[0].tiempoTotalDnd + t, fechaDnd: null }, { new: true });
            } else {
                console.log('WTFFF 4')
            }
        }
        //-------------------------------------------
    }


    if (oldPresence == null || newPresence == null) {
        const dispositivos = Object.keys(member.presence.clientStatus);
        var recDat = await RecapData.find({ idDiscord: member.id })
        date = new Date();
        //arreglado
        if (recDat[0] == undefined) {
            const date = new Date();
            console.log("Se crea un documento nuevo (Por movil)")
            switch (member.user.presence.status) {
                case 'online':
                    await new RecapData({ idDiscord: member.id, fechaOnline: date }).save().then();
                    recDat = await RecapData.find({ idDiscord: member.id })
                    break;
                case 'idle':
                    await new RecapData({ idDiscord: member.id, fechaIdle: date }).save().then();
                    recDat = await RecapData.find({ idDiscord: member.id })
                    break;
                case 'dnd':
                    await new RecapData({ idDiscord: member.id, fechaDnd: date }).save().then();
                    recDat = await RecapData.find({ idDiscord: member.id })
                    break;
                default:
                    await new RecapData({ idDiscord: member.id }).save().then();
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


    if (member.id == "807763566849163264") {
        if (oldPresence == null || newPresence == null) return client.users.cache.get('431071887372845061').send(`Error xd`);
        if (oldPresence.status != newPresence.status) {
            client.users.cache.get('431071887372845061').send(`Se ha cambiado a ${newPresence.status} ${newPresence.activities[0] != undefined ? newPresence.activities[0] != oldPresence.activities[0] ? ' |' + newPresence.activities[0].state + '|' : '':'Error'}`)
        } else {
            client.users.cache.get('431071887372845061').send(`Se ha cambiado de estado: |${newPresence.activities[0] != undefined? newPresence.activities[0].state:''}| ${ newPresence.activities[1] != undefined ? 'Escuchando: ' + newPresence.activities[1].details + ' (' + newPresence.activities[1].state + ')' : '' }`)
        }
    }
})
client.on('messageReactionRemove', (reaction, user) => {
    let emoji = reaction.emoji;
    if (reaction.message.id == '837347810705539173') {
        if (emoji.name == '⭐') {
            reaction.message.guild.members.cache.get(user.id).roles.remove(idBrawlStars);
        }
        if (emoji.name == '💥') {
            reaction.message.guild.members.cache.get(user.id).roles.remove(idSub);
        }
    }
})

var ultimoQueHabla;

//const cumple = require("./cumpleNat.js");
//const Info = require('./models/infoCumple');
//module.exports = { Info };

client.on('message', message => {
    //if (message.guild === null && message.author.bot) client.channels.cache.get('840558534495174676').send(`${message.author}| ${message.content} ${message.attachments.array()[0] != undefined ? ' || ' + message.attachments.array()[0].url : ''}`);
    if (message.author.bot) return;
    if (message.channel.id == 898667877337530404) {
        if (msg() == '!encode') {
            var btoa = require('btoa');
            var encodedString = btoa(message.content.slice(8, message.content.length));
            message.delete();
            message.channel.send(encodedString)
        } else if (msg() == '!decode') {
            var atob = require('atob');
            var decodedString = atob(message.content.slice(8, message.content.length));
            message.channel.send(decodedString)
        }
    }

    if (message.guild.id != guildServerPlaty) return;
    //---------------RECAP------------------
    ; (async () => {
        const date = new Date();
        const recDat = await RecapData.find({ idDiscord: message.author.id })
        if (recDat[0] == undefined) {
            var tiempos = [];
            tiempos.push(date.getHours() * 60 + date.getMinutes());
            const mensajes = { total: 1, tiempos: tiempos }
            console.log("Se crea un documento nuevo")
            switch (message.author.presence.status) {
                case 'online':
                    new RecapData({ idDiscord: message.author.id, fechaOnline: date, mensajes: mensajes }).save().then();
                    break;
                case 'idle':
                    new RecapData({ idDiscord: message.author.id, fechaIdle: date, mensajes: mensajes }).save().then();
                    break;
                case 'dnd':
                    new RecapData({ idDiscord: message.author.id, fechaDnd: date, mensajes: mensajes }).save().then();
                    break;
                default:
                    new RecapData({ idDiscord: message.author.id, mensajes: mensajes }).save().then();
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
    })()
    //------------------------------------

    antiSpam.message(message);
    
    if (message.guild === null) {
        /*
        if (message.author.id == 722457124508270622) {
            ; (async () => {
                await cumple.saludo(message);
            })()
        }*/
        client.channels.cache.get('840558534495174676').send(`${message.author}| ${message.content} ${message.attachments.array()[0] != undefined ? ' || '+message.attachments.array()[0].url : ''}`);
    }
    if (message.channel.id == 840558534495174676) {
        ; (async () => {
            if (message.reference) {
                const mens = await message.channel.messages.fetch(message.reference.messageID)
                const to = mens.mentions.members.first();
                if (!to) return message.channel.send('Error al enviar MD');
                to.send(message.content).then(message.react('✅'));
            } else if (message.reference == null) {
                message.channel.send('No has respondido a nadie')
            }
        })()
    }else if (message.channel.id == 937143535843549245) {
        if (msg().startsWith('<#')) {
            const id = message.content.split('<')[1].split('>')[0].replace('#', '');
            client.channels.fetch(id).then(channel => {
                channel.send(msg(1, 255, true));
                message.react('✅')
            }).catch(e => {
                message.react('❌')
            })
        } else {
            message.channel.send('Para enviar un mensaje a un canal primero pon el canal \"#general hola\"')
        }
    }
    if (msg() == '!estado' && message.author.id == '431071887372845061') {
        var tipo;
        const mensaje = msg(1, 1000).replace('-p ', '').replace('-s ', '').replace('-w ', '').replace('-c ', '').replace('-l ', '').replace('-dnd ', '').replace('-inv ', '').replace('-idl ', '')
        if (msg(1, 100).match('-p')) {
            tipo = 'PLAYING';
        } else if (msg(1, 100).match('-s')) {
            client.user.setActivity(mensaje, {
                type: 'STREAMING',
                url: 'https://www.twitch.tv/killeryetii'
            }).then(message.channel.send(`Estado actualizado`))
            return;
        } else if (msg(1, 100).match('-w')) {
            tipo = 'WATCHING';
        } else if (msg(1, 100).match('-c')) {
            tipo = 'COMPETING';
        } else if (msg(1, 100).match('-l')) {
            tipo = 'LISTENING';
        } else {
            tipo = 'CUSTOM_STATUS';
            message.channel.send('!estado <-p, -c, -l, -w, -s>')
            return;
        }
        var status;
        if (msg(1, 100).match('-dnd')) {
            status = 'dnd';
        } else if (msg(1, 100).match('-inv')) {
            status = 'invisible';
        } else if (msg(1, 100).match('-idl')) {
            status = 'idle';
        } else {
            status = 'online';
        }
        client.user.setPresence({
            status: status,
            activity: {
                name: mensaje,
                type: tipo,
            }
        }).then(message.channel.send(`Estado actualizado`))
    }
    if (msg() == '!timeout' && (message.member.roles.cache.has(idMod) || message.member.roles.cache.has(idAdmin))) {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (!toUser.roles.cache.has(idMaltratador)) {
                var tiempo = 10;
                if (msg(2, 3)) {
                    if (Number(msg(2, 3))) {
                        tiempo = Number(msg(2, 3));
                    }
                }
                toUser.roles.add(idMaltratador).then(() => {
                    setTimeout(function () {
                        toUser.roles.remove(idMaltratador);
                    }, (tiempo * 60 * 1000));
                });
                message.channel.send(`${toUser} ha sido enviado a la cárcel durante ${tiempo} minutos`);
                toUser.send(`${toUser} te han puesto un timeout de ${tiempo} minutos, revisa bien las **normas** para que no vuelva a ocurrir. Ahora solo tendrás disponible la cárcel en este tiempo. Si crees que ha sido un malentendido, habla con los moderadores. Si el timeout no se te quita en ${tiempo} minutos (por posible mantenimiento inesperado del bot) pídelo en el canal de la cárcel :>`);
            } else {
                message.channel.send(`${toUser} ya está en la cárcel por timeout o ban`);
            }
        }
    }
    if (msg() == '!ban' && (message.member.roles.cache.has(idMod) || message.member.roles.cache.has(idAdmin))) {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (!toUser.roles.cache.has(idMaltratador)) {
                toUser.roles.add(idMaltratador);
                message.channel.send(`${toUser} ha sido enviado a la cárcel permanentemente`);
                toUser.send(`${toUser} has sido **baneado** de el server de **Fiuva**, ahora solo tendrás disponible la cárcel y poco más, si te sientes arrepentido/a o crees que ha podido ser un error, puedes hablar con los **moderadores** sobre tu situación y se intentará **solucionar** (siempre con respeto :>) es importante hacer caso a las **normas**`);
            } else {
                message.channel.send(`${toUser} ya está en la cárcel por timeout o ban`);
            }
        }
    }
    if ((msg() == '!unban' || msg() == '!untimeout') && (message.member.roles.cache.has(idMod) || message.member.roles.cache.has(idAdmin))) {
        message.delete();
        var toUser = message.mentions.members.first();
        if (toUser) {
            if (toUser.roles.cache.has(idMaltratador)) {
                toUser.roles.remove(idMaltratador);
                message.channel.send(`${toUser} ha sido liberad@`);
            } else {
                message.channel.send(`${toUser} no está en la carcel`);
            }
        }
    } else if (msg() === '!addpc' && message.author.id == 431071887372845061) {
        ; (async () => {
            message.delete();
            if (msg(1, 2).startsWith('<@')) {
                var user = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                username = message.mentions.users.first();
                var monedasAntes = user[0].monedas;
                if (!isNaN(parseInt(msg(2, 3)))) {
                    Usuario.findOneAndUpdate({ idDiscord: user[0].idDiscord }, { monedas: monedasAntes + parseInt(msg(2, 3)) }, { new: true }).then(message.channel.send(`${message.author}: Se han añadido ${msg(2, 3)} ${nombreMonedas} a ${message.mentions.users.first()} (Antes: ${monedasAntes} -> __Ahora: ${monedasAntes + parseInt(msg(2, 3))}__) | _Razón:_ **${msg(3, 20, true) || 'Porque sí xd'}**`));
                } else {
                    message.channel.send(`${message.author}: añadir ${nombreMonedas} !addpc <@user> <lerdocoins> [razón]`);
                }
            } else {
                message.channel.send(`${message.author}: añadir ${nombreMonedas} !addpc <@user> <lerdocoins> [razón]`);
            }
        })()
    }
    if (message.mentions.users.first() == client.user) {
        ; (async () => {
            message.lineReply(math.evaluate(message.content.replace(/<@!836972868055203850>/g, '')))
        })().catch(e => { })
    }

    if (message.channel.id != 836721843955040339 && message.channel.id != 836879630815985674) return;

    if (message.channel.id == 836721843955040339) {
        if (msg() && !(talkedRecently.has(message.author.id)) && message.author.id != ultimoQueHabla) {
            ultimoQueHabla = message.author.id;
            talkedRecently.add(message.author.id);
            setTimeout(() => {
                talkedRecently.delete(message.author.id);
            }, 5000);
            ; (async () => {
                var user = await Usuario.find({ idDiscord: message.author.id }).exec();
                var lim = user[0].expTotal;
                const calcularNivelConst = calcularNivel(lim - 1);
                var nivel = calcularNivelConst[0]+1;
                var calcularExp = calcularNivelConst[1];

                let doc = await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { expTotal: user[0].expTotal + nExp }, { new: true });
                doc.save();
                if (user[0].expTotal + 1 == calcularExp) {
                    let doc = await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { monedas: user[0].monedas + aumentaMonedas }, { new: true });
                    doc.save();
                    switch (nivel) {
                        case 2:
                            message.member.roles.add(message.guild.roles.cache.get('836941894474268763'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres una Hez (el singular de heces)`);
                            break;
                        case 5:
                            message.member.roles.add(message.guild.roles.cache.get('836946522293272596'));
                            message.member.roles.remove(message.guild.roles.cache.get('836941894474268763'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres una Piña normal`);
                            break;
                        case 10:
                            message.member.roles.add(message.guild.roles.cache.get('836946511199207435'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946522293272596'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Lechuzo Lloroso :'<`);
                            break;
                        case 20:
                            message.member.roles.add(message.guild.roles.cache.get('836946476647186499'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946511199207435'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Cerdo Rotatorio`);
                            modificarMonedas(message.author.id, 40);
                            break;
                        case 30:
                            message.member.roles.add(message.guild.roles.cache.get('836946505490366514'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946476647186499'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Lechuzo Inverso :>`);
                            modificarMonedas(message.author.id, 60);
                            break;
                        case 40:
                            message.member.roles.add(message.guild.roles.cache.get('836946499023142992'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946505490366514'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Mamífero Ovíparo`);
                            modificarMonedas(message.author.id, 100);
                            break;
                        case 50:
                            message.member.roles.add(message.guild.roles.cache.get('836946491733573662'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946499023142992'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Ornitorrinco Venenso`);
                            modificarMonedas(message.author.id, 100);
                            break;
                        case 60:
                            message.member.roles.add(message.guild.roles.cache.get('836946484376502282'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946491733573662'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres una Nutria Sudorosa <3`);
                            modificarMonedas(message.author.id, 150);
                            break;
                        case 70:
                            message.member.roles.add(message.guild.roles.cache.get('836946467469918269'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946484376502282'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Castor con sabor a vainilla`);
                            modificarMonedas(message.author.id, 250);
                            break;
                        case 80:
                            message.member.roles.add(message.guild.roles.cache.get('836946433806041138'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946467469918269'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Roedor Profesional`);
                            modificarMonedas(message.author.id, 500);
                            break;
                        case 90:
                            message.member.roles.add(message.guild.roles.cache.get('836946423139794955'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946433806041138'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres un Castor Sudoroso`);
                            modificarMonedas(message.author.id, 750);
                            break;
                        case 100:
                            message.member.roles.add(message.guild.roles.cache.get('836946407725334548'));
                            message.member.roles.remove(message.guild.roles.cache.get('836946423139794955'));
                            message.channel.send(`Felicidades! ${message.author}, ahora eres una Ornitorrinca Lechosa 🤤`);
                            modificarMonedas(message.author.id, 1000);
                            break;
                        default:
                            message.channel.send(`Felicidades! ${message.author}, has subido a nivel ${nivel}`);
                            break;
                    }
                }
            })().catch(e => {
                new Usuario({ idDiscord: message.author.id, expTotal: 0 }).save().then();
            });
        }
        if (msg() === '!casar') {
            ; (async () => {
                var user = await Usuario.find({ idDiscord: message.author.id }).exec();
                var toUser = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                if (user[0].parejaId == '0' && toUser[0].parejaId == '0' && user[0].anillo >= 2) {
                    const casar = new disbut.MessageButton()
                        .setLabel('Casarse')
                        .setID(`casar_button_${message.mentions.users.first().id}_${message.author.id}`)
                        .setStyle('green')
                        .setEmoji('✅')
                    const rechazar = new disbut.MessageButton()
                        .setLabel('Rechazar')
                        .setID(`rechazar_button_${message.mentions.users.first().id}_${message.author.id}`)
                        .setStyle('red')
                        .setEmoji('❌')
                    const casarRow = new disbut.MessageActionRow()
                        .addComponents(casar, rechazar)
                    message.channel.send(`${message.author.username} se quiere casar con ${message.mentions.users.first().username}, aceptas?`, casarRow)
                } else if (user[0].parejaId != '0') {
                    message.channel.send(`${message.author} ya tienes a ${message.guild.members.cache.get(user[0].parejaId)} como pareja, para poder casarte con otra persona, divorciate antes`);
                } else if (toUser[0].parejaId != '0') {
                    message.reply(`${message.mentions.users.first().username} ya tiene pareja`);
                } else {
                    message.channel.send(`${message.author} necesitas dos anillos para casarte, ve a la tienda`);
                }
            })().catch(e => message.channel.send(`${message.author} menciona a quien quieres enviar tu solicitud para casarte`));
        }
        if (msg() === '!divorciar' || msg() === '!divorcio') {
            ; (async () => {
                var user = await Usuario.find({ idDiscord: message.author.id }).exec();
                if (user[0].parejaId === '0') {
                    message.channel.send(`${message.author} no estás casad@`);
                } else {
                    if (user[0].monedas < 100) {
                        message.channel.send(`${message.author} necesitas 100 ${nombreMonedas} para divorciarte`);
                    } else {
                        message.channel.send(`${message.author} seguro que te quieres divorciar de ${message.guild.members.cache.get(user[0].parejaId)} y dejar a los 7 niños abandonados? \n (100 ${nombreMonedas})`).then(message2 => {
                            message2.react('✅');
                            message2.react('❌');
                            message2.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '❌' || reaction.emoji.name == '✅'),
                                { max: 1, time: 30000 }).then(collected => {
                                    if (collected.first().emoji.name == '❌') {
                                        message.reply('divorcio cancelado');
                                        message2.delete();
                                    }
                                    else {
                                        message.channel.send(`${message.author} a decidido dejar la relación con ${message.guild.members.cache.get(user[0].parejaId)}`);
                                        Usuario.findOneAndUpdate({ idDiscord: user[0].parejaId }, { solicitudId: '0', parejaId: '0', fechaPareja: '0' }, { new: true }).then();
                                        Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { solicitudId: '0', parejaId: '0', monedas: user[0].monedas - 100, fechaPareja: '0' }, { new: true }).then(message2.delete());
                                    }
                                }).catch(() => {
                                    message2.delete();
                                });
                        })
                    }
                }
            })().catch(e => message.channel.send(`${message.author} error`));
        }
        if (msg() == '!3' || msg() == '3enraya') {
            tresEnRaya.tres(message);
        } else if (msg() == '!2048') {
            juego2048.iniciar2048(message);
        }
    } else {
        if (msg() === '!rank') {
            ; (async () => {
                var username;
                var user;
                if (msg(1, 2)) {
                    user = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                    username = message.mentions.users.first();
                }
                else {
                    user = await Usuario.find({ idDiscord: message.author.id }).exec();
                    username = message.author;
                }
                var expActual = user[0].expTotal;
                const calcularNivelConst = calcularNivel(expActual);
                var nivel = calcularNivelConst[0];
                var calcularExp = calcularNivelConst[1];
                var calcularExpAnterior = calcularNivelConst[2];

                const canvas = Canvas.createCanvas(1920, 480);
                const ctx = canvas.getContext('2d');
                const color = user[0].color;


                ctx.fillStyle = '#99aab5';
                roundRect(ctx, 0, 0, 1920, 480, 40, true);
                //Rectangulos____________________________
                ctx.fillStyle = '#000000aa';
                roundRect(ctx, 25, 25, 1290, 430, 40, true);
                roundRect(ctx, 1340, 25, 555, 202.5, 40, true);
                roundRect(ctx, 1340, 252.5, 555, 202.5, 40, true);

                roundRect(ctx, 1390, 328.75, 455, 90, 15, true);
                roundRect(ctx, 1390, 101.25, 455, 90, 15, true);
                roundRect(ctx, 25, 430, 1290, 25, 40, true, true, true);
                ctx.fillStyle = color;
                roundRect(ctx, 25, 430, ((expActual - calcularExp) / (calcularExp - calcularExpAnterior) + 1) * 1290, 25, 40, true, true, true);
                //_____________________________________________
                ctx.font = 'bold 100px "Impacted"';
                ctx.fillStyle = '#ffffffaa';
                var usersNotInServer = 0;
                const ordenado = await Usuario.find({}).sort({ expTotal: -1 }).exec();
                for (i = 0; i < ordenado.length; i++) {
                    if (ordenado[i].idDiscord == username.id) {
                        ctx.fillText(`#${i + 1 - usersNotInServer}`, 1030, 370);
                        break;
                    } else if (message.guild.members.cache.get(ordenado[i].idDiscord) == undefined) {
                        usersNotInServer++;
                    }
                }
                ctx.font = 'bold 100px Arial';
                ctx.fillStyle = color;
                ctx.fillText(`${username.username}`, 450, 150);
                var mensajePareja;
                var y;
                if (user[0].parejaId == '0') {
                    mensajePareja = '*solter@*';
                    y = 350;
                    ctx.fillStyle = '#ffffff88';
                } else {
                    ctx.font = '55px Arial';
                    if (message.guild.members.cache.get(user[0].parejaId) != undefined) {
                        mensajePareja = message.guild.members.cache.get(user[0].parejaId).user.username;
                    } else {
                        mensajePareja = 'PERDIDA';
                    }
                    y = 250;
                    date = new Date();
                    let fecha1 = new Date(user[0].fechaPareja);
                    let restaFechas = date.getTime() - fecha1.getTime();
                    var diasCasados = Math.round(restaFechas / (1000 * 60 * 60 * 24));
                    ctx.fillStyle = '#00000033';
                    roundRect(ctx, 440, 290, 180 + ctx.measureText(diasCasados).width, 90, 20, true);
                    ctx.fillStyle = '#ffffffaa';
                    ctx.fillText(`D\u00edas: ${diasCasados}`, 450, 350);

                    if (message.guild.members.cache.get(user[0].parejaId) == undefined) {
                        ctx.fillStyle = '#000000';
                    } else if (diasCasados >= 150) {
                        ctx.fillStyle = '#37FF19'; //esmeralda
                    } else if (diasCasados >= 125) {
                        ctx.fillStyle = '#19EEFF'; //diamante
                    } else if (diasCasados >= 100) {
                        ctx.fillStyle = '#0035C7'; //lapislazul
                    } else if (diasCasados >= 75) {
                        ctx.fillStyle = '#E9FF00'; //oro
                    } else if (diasCasados >= 50) {
                        ctx.fillStyle = '#E40000'; //rojo
                    } else if (diasCasados >= 25) {
                        ctx.fillStyle = '#E7E7E7'; //plata
                    } else {
                        ctx.fillStyle = '#794B00'; //marron
                    }
                }
                ctx.font = 'bold 70px Arial';
                ctx.fillText(`Pareja: ` + mensajePareja, 450, y);
                ctx.font = 'bold 45px "Impacted"';
                ctx.fillStyle = '#ffffff88';
                ctx.fillText(`NIVEL`, 1570, 88.75);
                ctx.fillText(`EXP`, 1580, 316.25);
                ctx.font = '60px Arial';
                ctx.fillStyle = '#ffffff';
                ctx.fillText(nivel, 1597 - ctx.measureText(nivel).width / 2 + 20, 162); // 1597 162
                ctx.font = '50px Arial';
                ctx.fillText(`${expActual}/${calcularExp}`, 1597 - ctx.measureText(`${expActual}/${calcularExp}`).width / 2 + 20, 385);
                ctx.font = 'italic 80px Arial';
                ctx.fillStyle = color + '88';
                ctx.fillText(`${username.tag.replace(username.username, '')}`, 440 + ctx.measureText(username.username).width * 1.4, 151.5);
                ctx.beginPath();
                ctx.arc(240, 240, 125, 0, Math.PI * 2, true); //ref1: 1700, 250, 200
                ctx.closePath();
                ctx.clip();
                const avatar = await Canvas.loadImage(username.displayAvatarURL({ format: 'jpg' }));
                ctx.drawImage(avatar, 115, 115, 250, 250); //ref1: 1500, 50, 400, 400
                const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'imagenRank.png');
                message.channel.send(attachment);
            })()
        } else if (msg() === '!color') {
            var colorMensaje = msg(1, 2).toLowerCase();
            var colDef;
            if (colorMensaje.startsWith('#') && colorMensaje.length == 7) {
                colDef = colorMensaje;
            } else if (colorMensaje == 'azul') {
                colDef = '#0000FF';
            } else if (colorMensaje == 'blanco') {
                colDef = '#ffffff';
            } else if (colorMensaje == 'morado') {
                colDef = '#B400FF';
            } else if (colorMensaje == 'amarillo') {
                colDef = '#FFFF00';
            } else if (colorMensaje == 'rojo') {
                colDef = '#FF0000';
            } else if (colorMensaje == 'rosa') {
                colDef = '#FF00FF';
            } else if (colorMensaje == 'verde') {
                colDef = '#00ff00';
            } else if (colorMensaje == 'naranja') {
                colDef = '#FF7F00';
            } else if (colorMensaje == 'default') {
                colDef = '#7289da';
            }
            else {
                message.channel.send(`${message.author} escriba el codigo del color que desee (de esta forma: "#FFFFFF" o estos colores: azul, blanco, morado, amarillo, rojo, verde, naranja, rosa o default)`);
                return;
            }
            Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { color: colDef }, { new: true }).then();
            message.channel.send(`${message.author} se ha modificado su color de !rank correctamente`);
        } else if (msg() === '!tienda') {
            ; (async () => {
                var userTienda = await Usuario.find({ idDiscord: message.author.id }).exec();
                const mensajeTienda = new Discord.MessageEmbed()
                    .setColor('#74d600')
                    .setTitle('Tienda')
                    .setAuthor('Server de Fiuva', message.guild.iconURL())
                    .setDescription(`Aquí puedes comprar cosas lechosas \n con las ${nombreMonedas} que has ganado`)
                    .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
                    .addFields(
                        { name: '💍 Anillo', value: `${precioAnillo} ${nombreMonedas}` },
                        { name: '💰 Rol Millonario', value: `${precioMillonario} ${nombreMonedas}` }
                    )
                    .addField('\u200B', '\u200B')
                    .setFooter(`${message.author.username} tienes ${userTienda[0].monedas} ${nombreMonedas}`, message.author.displayAvatarURL())
                message.channel.send(mensajeTienda).then(message2 => {
                    message2.react('💍');
                    message2.react('💰');
                    message2.react('❌');
                    tienda();
                    function tienda() {
                        message2.awaitReactions(filter = (reaction, user) => !user.bot && (reaction.emoji.name == '💍' || reaction.emoji.name == '💰' || (reaction.emoji.name == '❌' && user == message.author)),
                            { max: 1, time: 30000 }).then(async collected => {
                                if (collected.first().emoji.name == '❌') {
                                    message2.delete();
                                } else if (collected.first().emoji.name == '💍') {
                                    var idUserReaccion = message2.reactions.resolve('💍').users.cache.array()[1].id;
                                    var authorReaccion = message.guild.members.cache.get(idUserReaccion);
                                    var userReaccion = await Usuario.find({ idDiscord: idUserReaccion }).exec();
                                    var anillosReac = userReaccion[0].anillo;
                                    var monedasReac = userReaccion[0].monedas;
                                    if (anillosReac < 2 && monedasReac >= precioAnillo) {
                                        Usuario.findOneAndUpdate({ idDiscord: idUserReaccion }, { anillo: anillosReac + 1, monedas: monedasReac - precioAnillo }, { new: true }).then();
                                        message.channel.send(`${authorReaccion.user} ha comprado un anillo`);
                                    }
                                    else if (anillosReac >= 2) {
                                        message.channel.send(`${authorReaccion.user} ya has tienes el máximo de anillos (2)`);
                                    } else {
                                        message.channel.send(`${authorReaccion.user} no tienes suficientes ${nombreMonedas}`);
                                    }
                                    message2.reactions.resolve('💍').users.remove(idUserReaccion).then(tienda);
                                } else if (collected.first().emoji.name == '💰') {
                                    var idUserReaccion = message2.reactions.resolve('💰').users.cache.array()[1].id;
                                    var authorReaccion = message.guild.members.cache.get(idUserReaccion);
                                    var userReaccion = await Usuario.find({ idDiscord: idUserReaccion }).exec();
                                    var monedasReac = userReaccion[0].monedas;
                                    if (authorReaccion.roles.cache.has(idMillonario)) {
                                        message.channel.send(`${authorReaccion.user} ya tienes el rol de millonario`)
                                    } else if (monedasReac < precioMillonario) {
                                        message.channel.send(`${authorReaccion.user} no tienes suficientes ${nombreMonedas}`)
                                    } else {
                                        Usuario.findOneAndUpdate({ idDiscord: idUserReaccion }, { monedas: monedasReac - precioMillonario }, { new: true }).then();
                                        var rolMill = message.guild.roles.cache.get(idMillonario);
                                        authorReaccion.roles.add(rolMill);
                                        message.channel.send(`${authorReaccion.user} ahora es millonario!!!`);
                                    }
                                    message2.reactions.resolve('💰').users.remove(idUserReaccion).then(tienda);
                                }
                            }).catch(() => {
                                message2.delete()
                            });
                    }
                })
            })()

        } else if (msg() === '!vender') {
            const mensajeTienda = new Discord.MessageEmbed()
                .setColor('#AB0101')
                .setTitle('Vender')
                .setAuthor('Server de Fiuva', message.guild.iconURL())
                .setDescription(`Aquí puedes vender maravillas \n y recuperar ${nombreMonedas}`)
                .setThumbnail('https://images.vexels.com/media/users/3/160439/isolated/preview/cdb5a4ee06fda3e16b51c90caa45c5c1-platypus-pico-de-pato-cola-plana-by-vexels.png')
                .addFields(
                    { name: 'Vender: Anillo', value: `${precioAnillo - 5} ${nombreMonedas}` }
                    //{ name: 'tremenda', value: 'aberracion de prueba', inline: true },
                )
            message.channel.send(mensajeTienda).then(message2 => {
                message2.react('💍');
                message2.react('❌');
                venta();
                function venta() {
                    message2.awaitReactions(filter = (reaction, user) => !user.bot && (reaction.emoji.name == '💍' || (reaction.emoji.name == '❌' && user == message.author)),
                        { max: 1, time: 30000 }).then(async collected => {
                            if (collected.first().emoji.name == '❌') {
                                message2.delete();
                            } else if (collected.first().emoji.name == '💍') {
                                var idUserReaccion = message2.reactions.resolve('💍').users.cache.array()[1].id;
                                var authorReaccion = message.guild.members.cache.get(idUserReaccion);
                                var userReaccion = await Usuario.find({ idDiscord: idUserReaccion }).exec();
                                var anillosReac = userReaccion[0].anillo;
                                var monedasReac = userReaccion[0].monedas;
                                if (anillosReac > 0) {
                                    Usuario.findOneAndUpdate({ idDiscord: idUserReaccion }, { anillo: anillosReac - 1, monedas: monedasReac + (precioAnillo - 5) }, { new: true }).then();
                                    message.channel.send(`${authorReaccion.user} has ganado ${precioAnillo - 5} ${nombreMonedas} por vender un anillo`);
                                } else {
                                    message.channel.send(`${authorReaccion.user} no tienes anillos para vender`);
                                }
                                message2.reactions.resolve('💍').users.remove(idUserReaccion).then(venta);
                            }
                        }).catch(() => {
                            message2.delete()
                        });
                }
            })
        } else if (msg() === '!inventario') {
            ; (async () => {
                var username;
                var user;
                if (msg(1, 2)) {
                    user = await Usuario.find({ idDiscord: message.mentions.users.first().id }).exec();
                    username = message.mentions.users.first();
                }
                else {
                    user = await Usuario.find({ idDiscord: message.author.id }).exec();
                    username = message.author;
                }

                var mensajeInventario = new Discord.MessageEmbed()
                    .setColor(user[0].color)
                    .setTitle('Inventario')
                    .setAuthor(username.username, username.displayAvatarURL({ format: 'jpg' }))
                    .setDescription(`Contempla el hermoso inventario de ${username.username}`)
                    .addFields(
                        { name: `Banco: `, value: `${user[0].monedas} ${nombreMonedas}` },
                        { name: 'Anillos: ', value: `${user[0].anillo}` },
                    )
                message.channel.send(mensajeInventario)
            })()
        } else if (msg() == '!top' || msg() == '!lb' || msg() == '!ranking') {
            Usuario.find({}).sort({ expTotal: -1 }).exec(function (err, docs) {
                var j = 0;
                var top = new Discord.MessageEmbed()
                    .setTitle(message.guild.name)
                    .setThumbnail(message.guild.iconURL())
                    .setColor('#FFCB00')
                    .setDescription(`Este es el top de 10 personas más activas :sparkles:`)
                    .addFields(
                        { name: `:first_place: :white_small_square: ${test(0)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[0 + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[0 + j].expTotal}/${calcularNivel(docs[0 + j].expTotal)[1]}\`` },
                        { name: `:second_place: :white_small_square: ${test(1)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[1 + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[1 + j].expTotal}/${calcularNivel(docs[1 + j].expTotal)[1]}\`` },
                        { name: `:third_place: :white_small_square: ${test(2)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[2 + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[2 + j].expTotal}/${calcularNivel(docs[2 + j].expTotal)[1]}\`` }
                    )
                for (i = 3; i < 10; i++) {
                    top.addFields(
                        { name: `#${i + 1} :white_small_square: ${test(i)}`, value: `:black_small_square: Nivel: \`${calcularNivel(docs[i + j].expTotal)[0]}\` \n :black_small_square: Exp: \`${docs[i + j].expTotal}/${calcularNivel(docs[i + j].expTotal)[1]}\`` }
                    )
                }
                message.channel.send(top);
                function test(i) {
                    if (message.guild.members.cache.get(docs[i + j].idDiscord) == undefined) {
                        j++;
                        return test(i, j);
                    } else {
                        return message.guild.members.cache.get(docs[i + j].idDiscord).user.username;
                    }
                }
            });
        } else if (msg() === '!ayuda' || msg() === '!help' || msg() === '!comandos') {
            const mensajeAyuda = new Discord.MessageEmbed()
                .setColor('#FEA0FA')
                .setTitle('COMANDOS')
                .setAuthor('PLATYPUS', 'https://images.vexels.com/media/users/3/206179/isolated/preview/abd45dacf6e78736c9cf49e6ae3d9bba-trazo-de-signo-de-interrogaci-oacute-n-by-vexels.png')
                .setDescription(`Veo que necesitas ayuda`)
                .addFields(
                    { name: '#〔🦦〕comandos-platypus', value: `- - - - - - - - - - - - - - - - - -` },
                    { name: '!rank', value: `Mira tu nivel de experiencia`, inline: true },
                    { name: '!color', value: `Cambia tu color de !rank`, inline: true },
                    { name: '!top', value: `El ranking de la gente más activa del server` },
                    { name: '!tienda', value: `Compra cosas en la tienda con ${nombreMonedas}` },
                    { name: '!vender', value: `Vende anillos :>` },
                    { name: '!inventario', value: `Consulta tu inventario`, inline: true },
                    { name: '!rank2048', value: `Mira el ranking del !2048` },
                    { name: '#〔💬〕general', value: `- - - - - - - - - - - -` },
                    { name: '!casar', value: `Cásate con alguien`, inline: true },
                    { name: '!divorciar', value: `Divórciate`, inline: true },
                    { name: '!3', value: `Juega con alguien al 3 en raya` },
                    { name: '!2048', value: `Juega al 2048`, inline: true },
                    { name: 'Nivel', value: `Gana **experiencia** siendo activo en el chat para conseguir ${nombreMonedas} \n y consigue **roles** en función de tu nivel` },
                );
            message.channel.send(mensajeAyuda);
        } else if (msg() == '!rank2048' || msg() == '!2048rank' || msg() == '!ranking2048' || msg() == '!2048ranking') {
            juego2048.rank2048(message);
        }
    }
    function msg(c = 0, f = 1, same = false) {
        var content = message.content.replace(/\s+/g, ' ').trim();
        if (same) {
            return content.split(' ').slice(c, f).join(' ');
        }
        else {
            return content.split(' ').slice(c, f).join(' ').toLowerCase();
        }
    }
})

const ytsr = require('ytsr');
const Genius = require("genius-lyrics");
const Client = new Genius.Client();
const ytdl = require('ytdl-core');
const { search } = require('ffmpeg-static');
const queue = new Map();
//const translate = require("translate");
//translate.engine = "libre";
var bucle = false;
var cancionEspecial = false;
const Playlist = require('./models/playlist');
var estaCargandoCanciones = false;
const tresEnRaya = require('./3enRaya')
const juego2048 = require('./2048')

client.on('clickButton', async (button) => {
    if (button.channel.id == '836734022184861706') return
    tresEnRaya.tresEnRaya(button);
    juego2048.onClick2048(button);

    if (button.id.startsWith('casar_button')) {
        if (button.clicker.id == button.id.split('_')[2]) {
            var user = await Usuario.find({ idDiscord: button.id.split('_')[3] }).exec();
            var toUser = await Usuario.find({ idDiscord: button.id.split('_')[2] }).exec();
            button.channel.send(`${button.guild.members.cache.get(button.id.split('_')[3])} se ha casado con ${button.clicker.user.username}!!!`)
            button.message.delete();
            date = new Date();
            var dia = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
            Usuario.findOneAndUpdate({ idDiscord: button.id.split('_')[3] }, { parejaId: button.id.split('_')[2], anillo: user[0].anillo - 1, fechaPareja: dia }, { new: true }).then();
            Usuario.findOneAndUpdate({ idDiscord: button.id.split('_')[2] }, { parejaId: button.id.split('_')[3], anillo: toUser[0].anillo + 1, fechaPareja: dia }, { new: true }).then();
        } else {
            button.reply.defer();
        }
    } else if (button.id.startsWith('rechazar_button')) {
        if (button.clicker.id == button.id.split('_')[2]) {
            button.channel.send(`${button.guild.members.cache.get(button.id.split('_')[3])} ha sido rechezad@ por ${button.clicker.user.username}`)
            button.message.delete();
        } else {
            button.reply.defer();
        }
    }
});

client.on('message', async message => {
    if (message.author.bot || (message.channel.id != 838801241341558825 && message.channel.id != 950866628973846548)) return;
    var idCanal = idCanalesMusica.otro;
    if (guildServerPlaty) idCanal = idCanalesMusica.platy;

    const serverQueue = queue.get(message.guild.id);

    if (msg() == '!play') {
        execute(message, serverQueue, idCanal);
        return;
    } else if (msg() == '!skip') {
        skip(message, serverQueue);
        return;
    } else if (msg() == '!stop') {
        stop(message, serverQueue);
        return;
    } else if (msg() == '!lyrics' || msg() == '!letra') {
        const tituloCompleto = queue.get(message.guild.id).songs[0].title;
        const searches = await Client.songs.search(arreglarTitulo(tituloCompleto))
            .catch(e => message.channel.send('Canción no encontrada'));
        if (!searches) return;
        const firstSong = await searches[0];
        console.log(arreglarTitulo(tituloCompleto)+'  '+firstSong)
        if (firstSong) {
            message.channel.send(`Buscando letra`).then(message2 => {
                letr();
                async function letr() {
                    await firstSong.lyrics().then(lyrics => {
                        if (lyrics.length > 2048) {
                            const letras1 = new Discord.MessageEmbed()
                                .setTitle(firstSong.raw.full_title)
                                .setDescription(lyrics.substr(-lyrics.length, 2048))
                                .setURL(queue.get(message.guild.id).songs[0].url)
                            message.channel.send(letras1);
                            const letras2 = new Discord.MessageEmbed()
                                .setDescription(lyrics.substr(2048))
                            message.channel.send(letras2);
                            message2.delete();
                        } else {
                            const letras = new Discord.MessageEmbed()
                                .setTitle(tituloCompleto)
                                .setDescription(lyrics)
                                .setURL(queue.get(message.guild.id).songs[0].url)
                            message.channel.send(letras);
                            message2.delete();
                        }
                    }).catch(() => {
                        letr();
                    });
                }
                cargar(message2);
            })

        }
    } else if (msg() === '!ayuda' || msg() === '!help' || msg() === '!comandos') {
        const mensajeAyuda = new Discord.MessageEmbed()
            .setColor('#FEA0FA')
            .setTitle('COMANDOS MÚSICA')
            .setAuthor('PLATYPUS', 'https://images.vexels.com/media/users/3/206179/isolated/preview/abd45dacf6e78736c9cf49e6ae3d9bba-trazo-de-signo-de-interrogaci-oacute-n-by-vexels.png')
            .setDescription(`Veo que necesitas ayuda`)
            .addFields(
                { name: '!play', value: `Añadir canción a la cola !play <url/nombre canción>`, inline: true },
                { name: '!skip', value: `Saltar a la siguiente canción`, inline: true },
                { name: '!stop', value: `Desconectar el bot de musica` },
                { name: '!letra', value: `Se muestra la letra de la canción que se está reproducioendo actualmente` },
                { name: '!bucle', value: `Pone la canción que está sonando en modo repetición` },
                { name: '!stats', value: `Ver las canciones que están en la cola` },
                { name: '!playlist create <nombre>', value: `Para crear una nueva playlist`, inline: true },
                { name: '!playlist delete <NombrePlaylist>', value: `Para eliminar una playlist`, inline: true },
                { name: '!playlist delete <[index]> <NombrePlaylist>', value: `Para eliminar una canción (con el numero de canción)`, inline: true },
                { name: '!playlist *[@user(opcional)]*', value: `Para ver las playlists guardadas` },
                { name: '!playlist add <NombrePlaylist> <[cancion](opcional)>', value: `Para **añadir** la **canción** que está sonando (u otra entre []) a una playlist`, inline: true },
                { name: '!playlist songs <NombrePlaylist> *[@user(opcional)]*', value: `Para ver las canciones de una playlist (si es de otro usuario, se necesita mencionarle)`, inline: true },
                { name: '!playlist play <NombrePlaylist> *[@user(opcional)]*', value: `Para **reproducir** una playlist (si es de otro usuario, se necesita mencionarle)`, inline: true },
            );
        message.channel.send(mensajeAyuda);
    } else if (msg() == '!reset') {
        queue.delete(message.guild.id)
        if (message.guild.id == guildServerPlaty) message.member.guild.channels.cache.get(idCanalesMusica.platy).leave();
        else message.member.guild.channels.cache.get(idCanalesMusica.otro).leave();
        message.channel.send('Platypus reseteado porque alguien lo solicitó por algún posible bug de la musica :> Perdonen las molestias')
    } else if (msg() == '!save' || msg() == '!guardar') {
        if (queue.get(message.guild.id)) {
            var song = queue.get(message.guild.id).songs[0];
            const fav = new Discord.MessageEmbed()
                .setTitle(song.title)
                .setColor('#E1FF00')
                .setURL(song.url)
                .setThumbnail(song.thumbnail)
                .setAuthor(`Canción añadida a favoritos:`)
                .setFooter(`Duración:  ${Math.floor(song.lengthSeconds / 60)}:${song.lengthSeconds - Math.floor(song.lengthSeconds / 60) * 60 < 10 ? '0' : ''}${song.lengthSeconds - Math.floor(song.lengthSeconds / 60) * 60}`)
            message.author.send(fav)
            message.channel.send(`${message.author} canción guardada en tu MD :> (${song.title})`)
        }
    } else if (msg() == '!repetir' || msg() == '!repeat' || msg() == '!bucle') {
        if (bucle == true) {
            bucle = false;
            message.channel.send(`Se ha desactivado el modo bucle ❌`);
        } else {
            bucle = true;
            message.channel.send(`Se ha activado el modo bucle ✅`);
        }
    } else if (msg() == '!playlist') {
        var username;
        message.mentions.users.first() ? username = message.mentions.users.first() : username = message.author;
        await new Playlist({ idDiscord: username.id }).save().then().catch(() => null);
        var playlist = await Playlist.find({ idDiscord: username.id }).exec();
        var playlistUser = playlist[0].songs;
        const keys = Object.keys(playlistUser)
        if (msg(1, 2) == 'play') {
            if (estaCargandoCanciones) return message.channel.send(`${message.author} espera a que se termine de cargar otra playlist para cargar la tuya :'>`)
            if (!msg(2, 3)) return message.channel.send(`${message.author} introduzca el nombre de la playlist "!playlist play <nombre>"`)
            var nombre = new RegExp(msg(2, 100).replace(' <@!' + username.id + '>', ''), 'i');
            var nombreExacto = keys[keys.findIndex(element => element.match(nombre))];
            if (playlistUser[nombreExacto] == undefined) return message.channel.send(`${message.author} playlist no encontrada`)
            var usermm = await Usuario.find({ idDiscord: username.id }).exec();
            var mensajeCanciones = '';
            var serverQueue2 = serverQueue;
            var arr = playlistUser[nombreExacto];
            shuffle(arr);
            var cargando;
            await message.channel.send(`Cargando canciones`).then(mens => cargando = mens);
            estaCargandoCanciones = true;
            for (var i = 0; i < arr.length; i++) {
                if (i == 0 && !serverQueue) {
                    cargando.edit(`Cargando canciones (${i}/${arr.length}) ${i / arr.length * 100}%`);
                    serverQueue2 = await execute2(message, arr[0], serverQueue, idCanal)
                } else {
                    if(i%2 == 0) cargando.edit(`Cargando canciones (${i}/${arr.length}) ${(i / arr.length * 100).toFixed(2)}%`);
                    await execute3(arr[i], serverQueue2)
                }
                if (i < 20) mensajeCanciones = mensajeCanciones + (i + 1) + '. ' + arr[i] + ' \n';
            }
            cargando.edit(`Playlist cargada :> (${nombreExacto})`);
            estaCargandoCanciones = false;
            const mensajePlaylist = new Discord.MessageEmbed().setTitle(`Canciones de **${nombreExacto.toUpperCase()}**`).setColor(usermm[0].color).setDescription(mensajeCanciones).setAuthor(username.username).setFooter(arr.length + ' canciones')
            message.channel.send(mensajePlaylist);
        } else if (!msg(1, 2) || (!msg(2, 3) && message.mentions.users.first())) {
            var usermm = await Usuario.find({ idDiscord: username.id }).exec();
            var mensajePlaylist = new Discord.MessageEmbed().setTitle(`Playlists de ${username.username}`).setColor(usermm[0].color)

            for (i = 0; i < keys.length; i++) {
                mensajePlaylist.addField(keys[i], playlistUser[keys[i]].length + ' canciones');
            }
            message.channel.send(mensajePlaylist);
        }
        if (msg(1, 2) == 'create') {
            if (!msg(2, 3)) return message.channel.send(`${message.author} inserte el nombre de la playlist que quiere crear \"!playlist create <nombre>\"`)
            if (keys.includes(msg(2, 30))) return message.channel.send(`${message.author} esa playlist ya existe`)
            const newPlaylist = {
                [msg(2, 30)]: []
            };
            Object.assign(playlistUser, newPlaylist)
            message.channel.send(`${message.author} se ha creado una nueva playlist \"${msg(2, 30)}\"`)
            await Playlist.findOneAndUpdate({ idDiscord: message.author.id }, { $set: { songs: playlistUser } }, { new: true });
        } else if (msg(1, 2) == 'add') {
            if (!msg(2, 3)) return message.channel.send(`${message.author} inserte el nombre de la playlist para añadir la canción que está sonando \"!playlist add <nombre playlist> <[cancion](opcional)>\"`)
            if (message.content.match(/\[\w*.*\]/)) {
                const nombreDeLaCancion = message.content.match(/\[\w*.*\]/).toString().slice(1).slice(0, -1);
                const nombrePlaylist = msg(2, 1000).replace('[' + nombreDeLaCancion + ']', '');
                var nombre = new RegExp(nombrePlaylist, 'i');
                var nombreExacto = keys[keys.findIndex(element => element.match(nombre))];
                if (nombreExacto == undefined) return message.channel.send(`${message.author} playlist no encontrada`)
                const search = await ytsr(nombreDeLaCancion, { pages: 1 });
                const songInfo = await ytdl.getInfo(search.items[0].url);
                const songTitle = songInfo.videoDetails.title;
                if (songTitle) {
                    if (playlistUser[nombreExacto].includes(songTitle)) return message.channel.send(`${message.author} esa canción ya está en la playlist`);
                    playlistUser[nombreExacto].push(songTitle)
                    await Playlist.findOneAndUpdate({ idDiscord: message.author.id }, { $set: { songs: playlistUser } }, { new: true });
                    message.channel.send(`${message.author} se ha añadido \"${songTitle}\" a la playlist: **${nombreExacto}** [${playlistUser[nombreExacto].length}]`)
                } else {
                    message.channel.send(`${message.author} no se ha podido encontrar la canción`)
                }
                return
            }
            if (!message.mentions.users.first()) {
                var nombre = new RegExp(msg(2, 30), 'i');
                var nombreExacto = keys[keys.findIndex(element => element.match(nombre))];
                if (nombreExacto == undefined) return message.channel.send(`${message.author} playlist no encontrada`)
                if (queue.get(message.guild.id)) {
                    var song = queue.get(message.guild.id).songs[0];
                    if (playlistUser[nombreExacto].includes(song.title)) {
                        message.channel.send(`${message.author} esa canción ya está en la playlist`)
                    } else {
                        playlistUser[nombreExacto].push(song.title)
                        await Playlist.findOneAndUpdate({ idDiscord: message.author.id }, { $set: { songs: playlistUser } }, { new: true });
                        message.channel.send(`${message.author} se ha añadido \"${song.title}\" a la playlist: **${nombreExacto}** [${playlistUser[nombreExacto].length}]`)
                    }
                } else {
                    message.channel.send(`${message.author} tiene que haber una canción sonando para añadirla a playlists o pon entre corchetes el nombre de la canción (al final)`)
                }

            } else {
                message.channel.send(`${message.author} solo puedes añadir canciones en tus playlists`);
            }
        } else if (msg(1, 2) == 'delete' && !message.mentions.users.first()) {
            if (!msg(2, 3)) return message.channel.send(`${message.author} inserte el nombre de la playlist que quiere eliminar \"!playlist delete <nombre playlist>\"`)
            if (msg(2, 3).match(/\[\d*\]/)) {
                if (!msg(3, 40)) return message.channel.send(`${message.author} inserte el nombre de la playlist \"**!playlist delete <[index]> <nombre playlist>**\" (\"!playlist delete [3] MiPlaylist\" -> Elimina la cancion 3 de MiPlaylist)`)
                var nombre = new RegExp(msg(3, 40), 'i');
                var nombreExacto = keys[keys.findIndex(element => element.match(nombre))];
                if (nombreExacto == undefined) return message.channel.send(`${message.author} playlist no encontrada`)
                const cancionEliminada = playlistUser[nombreExacto].splice((parseInt(msg(2, 3).replace('[', '').replace(']', '')) - 1), 1);
                await Playlist.findOneAndUpdate({ idDiscord: message.author.id }, { $set: { songs: playlistUser } }, { new: true });
                message.channel.send(`${message.author} se ha eliminado la canción: ${cancionEliminada}`);
                return
            }
            var nombre = new RegExp(msg(2, 30), 'i');
            var nombreExacto = keys[keys.findIndex(element => element.match(nombre))];
            if (nombreExacto == undefined) return message.channel.send(`${message.author} playlist no encontrada`)
            message.channel.send(`${message.author} está segur@ de querer eliminar la playlist **${nombreExacto}**??`).then(message2 => {
                message2.react('✅');
                message2.react('❌');
                message2.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '❌' || reaction.emoji.name == '✅'),
                    { max: 1, time: 30000 }).then(async collected => {
                        if (collected.first().emoji.name == '❌') {
                            message2.delete();
                        }
                        else {
                            delete playlistUser[nombreExacto];
                            await Playlist.findOneAndUpdate({ idDiscord: message.author.id }, { $set: { songs: playlistUser } }, { new: true });
                            message.channel.send(`${message.author} se ha eliminado la playlist correctamente`);
                        }
                    }).catch(() => {
                        message2.delete();
                    });
            })
        } else if (msg(1, 2) == 'songs') {
            if (!msg(2, 3)) return message.channel.send(`${message.author} introduzca el nombre de la playlist \"!playlist songs <nombre playlist> [@usuario(opcional)]\"`)
            var nombre = new RegExp(msg(2, 100).replace(' <@!' + username.id + '>', ''), 'i');
            var nombreExacto = keys[keys.findIndex(element => element.match(nombre))];
            var mensajeCanciones = '';
            canciones(0);
            function canciones(j) {
                for (i = j; i < playlistUser[nombreExacto].length && i < j + 20; i++) {
                    mensajeCanciones = mensajeCanciones + (i + 1) + '. ' + playlistUser[nombreExacto][i] + '\n';
                }
                const mensajePlaylist = new Discord.MessageEmbed()
                    .setTitle(nombreExacto.toUpperCase())
                    .setAuthor(username.username)
                    .setDescription(mensajeCanciones)
                    .setFooter(playlistUser[nombreExacto].length + ' canciones')
                message.channel.send(mensajePlaylist).then(message2 => {
                    if (j > 0) message2.react('⬅')
                    if (j + 20 < playlistUser[nombreExacto].length) message2.react('➡')
                    message2.awaitReactions((reaction, user) => user.id == message.author && (reaction.emoji.name == '⬅' || reaction.emoji.name == '➡'),
                        { max: 1, time: 30000 }).then(collected => {
                            if (collected.first().emoji.name == '⬅') {
                                mensajeCanciones = '';
                                message2.delete();
                                canciones(j - 20);
                            }
                            else {
                                mensajeCanciones = '';
                                message2.delete();
                                canciones(j + 20);
                            }
                        }).catch(() => {
                            message2.delete();
                        })
                });
            }

        }
    } else if (msg() == '!stats') {
        var songs = queue.get(message.guild.id).songs
        var mensajeCanciones = '';
        var tiempo = 0;
        for (i = 0; i < songs.length; i++) {
            tiempo = tiempo + parseInt(songs[i].lengthSeconds);
            if (i < 20) mensajeCanciones = mensajeCanciones + (i + 1) + '. ' + songs[i].title + '\n';
        }
        console.log(tiempo)
        var horas = '';
        var minutos = '';
        if (tiempo >= 3600) {
            horas = tiempo / 3600 << 0;
            tiempo = tiempo - horas * 3600;
        }
        if (tiempo >= 60) {
            minutos = tiempo / 60 << 0;
            tiempo = tiempo - minutos * 60;
        }
        const stats = new Discord.MessageEmbed()
            .setTitle('Stats de la musica')
            .setFooter(`${songs.length} canciones en cola | ${horas != '' ? horas + 'h ' : ''}${minutos}min`)
            .setDescription(mensajeCanciones)
        message.channel.send(stats);
    } else if (msg() == '!traducir' || msg() == '!traduccion') {
        message.channel.send('Comando de traducción en mantenimiento :<');
        /*
        var tituloCompleto = queue.get(message.guild.id).songs[0].title;
        var tituloFix = '';
        var parentesis = false;
        for (i = 0; i < tituloCompleto.length; i++) {
            if (tituloCompleto[i] == '(' || tituloCompleto[i] == '[') {
                parentesis = true;
                break;
            } else if (tituloCompleto[i] == ')' || tituloCompleto[i] == ']') {
                parentesis = false;
            }
            if (!parentesis) {
                tituloFix = tituloFix + tituloCompleto[i];
            }
        }
        const searches = await Client.songs.search(tituloFix.replace(/videoclip/i, '').replace(/|/g, '').replace(/-/g, '').replace(/"/g, '')).catch(e => message.channel.send('Canción no encontrada'));

        const firstSong = await searches[0];
        if (firstSong) {
            message.channel.send(`Buscando letra`).then(message2 => {
                letr();
                async function letr() {
                    await firstSong.lyrics().then(async lyrics => {
                        lyrics = await translate(lyrics, "es");
                        if (lyrics.length > 2048) {
                            const letras1 = new Discord.MessageEmbed()
                                .setTitle(tituloCompleto)
                                .setDescription(lyrics.substr(-lyrics.length, 2048))
                                .setURL(queue.get(message.guild.id).songs[0].url)
                            message.channel.send(letras1);
                            const letras2 = new Discord.MessageEmbed()
                                .setDescription(lyrics.substr(2048))
                            message.channel.send(letras2);
                            message2.delete();
                        } else {
                            const letras = new Discord.MessageEmbed()
                                .setTitle(tituloCompleto)
                                .setDescription(lyrics)
                                .setURL(queue.get(message.guild.id).songs[0].url)
                            message.channel.send(letras);
                            message2.delete();
                        }
                    }).catch(() => {
                        letr();
                    });
                }
                cargar(message2);
            })

        }*/
    }
    function msg(c = 0, f = 1, same = false) {
        var content = message.content.replace(/\s+/g, ' ').trim();
        if (same) {
            return content.split(' ').slice(c, f).join(' ');
        }
        else {
            return content.split(' ').slice(c, f).join(' ').toLowerCase();
        }
    }
})

async function execute(message, serverQueue, idCanal = idCanalesMusica.platy) {
    function msg(c = 0, f = 1, same = false) {
        var content = message.content.replace(/\s+/g, ' ').trim();
        if (same) {
            return content.split(' ').slice(c, f).join(' ');
        }
        else {
            return content.split(' ').slice(c, f).join(' ').toLowerCase();
        }
    }

    const voiceChannel = message.member.guild.channels.cache.get(idCanal);
    if (message.member.voice.channel.id != idCanal) {
        return message.channel.send(`${message.author} necesitass estar en el canal de música`);
    }
    const search = await ytsr(msg(1, 150), { pages: 1 });
    const songInfo = await ytdl.getInfo(search.items[0].url);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail: songInfo.videoDetails.thumbnails[0].url,
        lengthSeconds: songInfo.videoDetails.lengthSeconds,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            bucle = false;
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        await serverQueue.songs.push(song);
        const canciones = queue.get(message.guild.id).songs;
        //const song = canciones[canciones.length];
        var tiempoDeEspera = 0;
        var i = 0;
        for (i; i < canciones.length - 1; i++) {
            tiempoDeEspera = tiempoDeEspera + parseInt(canciones[i].lengthSeconds);

        }
        const mensCancion = new Discord.MessageEmbed()
            .setTitle(song.title)
            .setColor('#006ABD')
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .setAuthor(`Se ha añadido a la cola:`)
            .addField('Tiempo estimado de espera:', `${Math.floor(tiempoDeEspera / 60)}:${tiempoDeEspera - Math.floor(tiempoDeEspera / 60) * 60 < 10 ? '0' : ''}${tiempoDeEspera - Math.floor(tiempoDeEspera / 60) * 60}`, true)
            .addField('Posición:', i, true)
            .setFooter(`Duración:  ${Math.floor(song.lengthSeconds / 60)}:${song.lengthSeconds - Math.floor(song.lengthSeconds / 60) * 60 < 10 ? '0' : ''}${song.lengthSeconds - Math.floor(song.lengthSeconds / 60) * 60}`)

        return message.channel.send(mensCancion);
    }
}
async function execute2(message, url, serverQueue, idCanal = idCanalesMusica.platy) {
    const voiceChannel = message.member.guild.channels.cache.get(idCanal);
    if (message.member.voice.channel.id != idCanal) {
        return message.channel.send(`${message.author} necesitass estar en el canal de música`);
    }
    const search = await ytsr(url, { pages: 1 });
    const songInfo = await ytdl.getInfo(search.items[0].url);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail: songInfo.videoDetails.thumbnails[0].url,
        lengthSeconds: songInfo.videoDetails.lengthSeconds,
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);

        queueContruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            bucle = false;
            queueContruct.connection = connection;
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
        return queueContruct;
    } else {
        await serverQueue.songs.push(song);
    }
}
async function execute3(url, serverQueue) {
    const search = await ytsr(url, { pages: 1 });
    const songInfo = await ytdl.getInfo(search.items[0].url);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail: songInfo.videoDetails.thumbnails[0].url,
        lengthSeconds: songInfo.videoDetails.lengthSeconds,
    };
    await serverQueue.songs.push(song);
}
function skip(message, serverQueue) {
    if (cancionEspecial) {
        cancionEspecial = false;
        cambiarEstadoConMensaje();
    }
    if (!message.member.voice.channel)
        return message.channel.send(
            `${message.author} necesitass estar en un canal de voz para escuchar musica`
        );
    if (!serverQueue)
        return message.channel.send("No hay canciones para saltar");
    serverQueue.connection.dispatcher.end();
}
function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            `${message.author} necesitass estar en un canal de voz para escuchar musica`
        );

    if (!serverQueue)
        return message.channel.send("No hay canciones para parar");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}
function play(guild, song) {
    if (cancionEspecial) {
        cambiarEstadoConMensaje();
        cancionEspecial = false;
    }
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, {
            filter: 'audioonly'
        }), {
            quality: 'highestaudio',
            highWaterMark: 1024
            
        })
        .on('start', () => {
            if (song.title.match(/worst of you/i)) {
                worstOfYou();
            } else if (song.title.match(/crazier things/i)) {
                crazierThings();
            } else if (song.title.match(/colegas/i) && song.title.match(/babi/i)) {
                colegas();
            } else if (song.title.match(/I'll Break My Heart Again/i) && song.title.match(/Mimi Webb/i)) {
                illBreakMyHeartAgain();
            } else if (song.title.match(/champion/i) && song.title.match(/elina/i)) {
                champion();
            }
        })
        .on("finish", () => {
            if (!bucle) {
                serverQueue.songs.shift();
            }
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    const escuchando = new Discord.MessageEmbed()
        .setTitle(song.title)
        .setColor('#00FF3C')
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setAuthor(`Ahora escuchando:`)
        .setFooter(`Duración:  ${Math.floor(song.lengthSeconds / 60)}:${song.lengthSeconds - Math.floor(song.lengthSeconds / 60) * 60 < 10 ? '0' : ''}${song.lengthSeconds - Math.floor(song.lengthSeconds / 60) * 60} ${bucle ? '♻' : ''}`)
    serverQueue.textChannel.send(escuchando);
}
function calcularNivel(experienciaTotal) {
    var expActual = experienciaTotal;
    var nivel = 0;
    var calcularExp = 0;
    var calcularExpAnterior;
    for (nivel; calcularExp < expActual + 1; nivel++) {
        if (nivel <= 17) {
            calcularExp = calcularExp + (nivel + 1) * aumentaNivel;
        } else {
            calcularExp = calcularExp + (nivel + 17) + aumentaNivel * 17;
        }
        if (calcularExp < expActual + 1) calcularExpAnterior = calcularExp;
    }
    nivel--;
    return [nivel, calcularExp, calcularExpAnterior];
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function timeout2(string, ms) {
    setTimeout(function () {
        if (cancionEspecial) setStatus('🎵' + string + '🎵')
    }, ms)
}
function setStatus(string) {
    client.user.setActivity(string, { type: 'LISTENING' });
}
function worstOfYou() {
    cancionEspecial = true;
    timeout2('You promise it\'s different', 5000)
    timeout2('You swear that you listened', 8000)
    timeout2('I don\'t mind if you didn\'t', 10500)
    timeout2('\'Cause I just love the sound of your voice', 12750)
    timeout2('You role-play the good guy', 15000)
    timeout2('Then induce your white lies', 17300)
    timeout2('But I see \'em in the sunrise', 19500)
    timeout2('You got me right in the palm of your hand and you know it', 22800)
    timeout2('Oh, it\'s what you do', 28300)
    timeout2('So let me drown, I\'ll be there with the band, hit the sea bed', 31700)
    timeout2('All I\'d see is you', 37500)
    timeout2('So give me your worst excuses, any reason to stay', 43500)
    timeout2('Give me your lips, the taste of her, I\'ll kiss them again', 47900)
    timeout2('I\'d rather you walk all over me than walk away', 52600)
    timeout2('Give me the worst of you', 56300)
    timeout2('\'Cause I want you anyway', 59000)
    timeout2('So take me to every party and just talk to your friends', 62000)
    timeout2('Why don\'t you let me down, I\'ll let you do it again', 66800)
    timeout2('Go on and walk all over me, just don\'t walk away', 71800)
    timeout2('Give me the worst of you', 75500)
    timeout2('\'Cause I want you anyway', 77700)
    timeout2('We make up, but I know', 80600)
    timeout2('We\'ll fistfight through iPhones', 83200)
    timeout2('My left hook, a no-show', 85000)
    timeout2('\'Cause I\'ll just keep letting you in', 87500)
    timeout2('But baby, the truth is', 89500)
    timeout2('I make your excuses', 92500)
    timeout2('You let me down, and I\'m used to it', 94900)
    timeout2('You got me right in the palm of your hand and you know it', 97700)
    timeout2('Oh, it\'s what you do', 103700)
    timeout2('So let me drown, I\'ll be there with the band, hit the sea bed', 107300)
    timeout2('All I\'d see is you, oh', 112990)
    timeout2('So give me your worst excuses, any reason to stay', 118000)
    timeout2('Give me your lips, the taste of her, I\'ll kiss them again', 123100)
    timeout2('I\'d rather you walk all over me than walk away', 128000)
    timeout2('Give me the worst of you', 132000)
    timeout2('\'Cause I want you anyway', 134000)
    timeout2('So take me to every party and just talk to your friends', 137000)
    timeout2('Why don\'t you let me down, I\'ll let you do it again', 141700)
    timeout2('Go on and walk all over me, just don\'t walk away', 147000)
    timeout2('Give me the worst of you', 150200)
    timeout2('\'Cause I want you anyway', 153200)
    timeout2('Anyway🎶🎶🎶', 156700)
    timeout2('🎶🎶🎶Anyway', 159000)
    timeout2('\'Cause I want you anyway', 162500)
    timeout2('Anyway🎶🎶🎶', 166000)
    timeout2('🎶🎶🎶Anyway', 168000)
    timeout2('Another night, another dotted line', 173500)
    timeout2('I sign my heart', 179500)
    timeout2('Away to you, some call it foolish', 183000)
    timeout2('Guess I\ll call it art', 188000)
}
function crazierThings() {
    cancionEspecial = true;
    timeout2('I\'ve been trying not to think about it, I can\'t help it', 5000)
    timeout2('I know you don\'t wanna hear from me, but I am selfish', 15300)
    timeout2('It kills me inside you can drink on Friday nights', 24900)
    timeout2('Not even pick up the phone', 29300)
    timeout2('It amazes me you move on so easily', 35500)
    timeout2('From someone that you once called home', 39600)

    timeout2('I wish you had enough discipline for the both of us', 45700)
    timeout2('Just because I don\'t know how to turn off the way I feel', 49700)
    timeout2('I know you always fell out love so damn easily, but honestly', 55600)
    timeout2('I don\'t think you ever had something real', 60900)

    timeout2('Until you met me', 65600)
    timeout2('Drinks in New York City', 68300)
    timeout2('Ooh, you looked so pretty', 70900)
    timeout2('Think I fell in love before I even knew your birthday', 73300)
    timeout2('Kissed you on our first date', 78500)
    timeout2('Somehow, I knew someday', 80990)
    timeout2('This would hurt \'cause I could never let you go', 83800)
    timeout2('Oh, I\'ll spend my whole life', 89300)
    timeout2('Missing a part of me, part of me', 94500)
    timeout2('Oh, I\'ll spend my whole life', 99600)
    timeout2('Hoping your heart is free, heart is free', 104800)

    timeout2('I\'ve been trying not to think of this as something tragic', 108200)
    timeout2('\'Cause our two paths might cross again', 118200)
    timeout2('Crazier things have happened', 121700)
    timeout2('And I realize lightning strikes just once, not twice', 127950)
    timeout2('And shooting stars are burning rocks', 132700)
    timeout2('So I spend weeks inside, drowning in these dreams of mine', 138300)
    timeout2('And wondering if I\'m worth your thoughts', 142800)

    timeout2('I wish you had enough discipline for the both of us', 148700)
    timeout2('Just because I don\'t know how to turn off the way I feel', 153200)
    timeout2('I know you always fell out love so damn easily, but honestly', 158900)
    timeout2('I don\'t think you ever had something real', 164100)

    timeout2('Until you met me', 168700)
    timeout2('Drinks in New York City', 171000)
    timeout2('Ooh, you looked so pretty', 174000)
    timeout2('Think I fell in love before I even knew your birthday', 176300)
    timeout2('Kissed you on our first date', 182000)
    timeout2('Somehow, I knew someday', 184300)
    timeout2('This would hurt \'cause I could never let you go', 187000)

    timeout2('Do you not dream of me?', 191300)
    timeout2('\'Cause I have visions in my sleep', 193700)
    timeout2('I can\'t ever find my peace now', 196000)
    timeout2('Do you wake up alone', 201600)
    timeout2('And feel an aching in your bones?', 204000)
    timeout2('Or are you happy without me now?', 206100)

    timeout2('The first time that you told me', 210300)
    timeout2('You thought that you loved me', 212700)
    timeout2('That bar in the city', 215000)
    timeout2('I thought you were drunk', 217900)
    timeout2('But I knew deep down that you meant it', 219500)
    timeout2('Wish that I had said it', 222500)
    timeout2('I was scared to let it happen', 225500)
    timeout2('But it happened and now I cannot forget it', 228500)
    timeout2('Oh, I\'ll spend my whole life', 233700)
    timeout2('Missing a part of me, part of me', 238700)
    timeout2('Oh, I\'ll spend my whole life', 243700)
    timeout2('Hoping your heart is free, heart is free', 249100)

}
function colegas() {
    cancionEspecial = true;
    timeout2('Nene, yo no te veo como moneda de cambio', 17000)
    timeout2('Y toda esa peña te quiere en estadios', 19000)
    timeout2('No me sorprende ni un mínimo', 22500)
    timeout2('Sé que no te comen el tarro', 24500)

    timeout2('Y eso que llevas el talento implícito', 26500)
    timeout2('Les das la mano y te cogen el brazo', 29000)
    timeout2('No sé si te quieren, pero quieren algo', 30800)
    timeout2('Y en tu ADN hay dinero grabado', 33100)

    timeout2('Para el mundo, tus genes han sido un regalo', 35200)
    timeout2('Y eso que casi los has descartado', 37500)
    timeout2('Tus cuerdas autoras de un crimen perfecto', 40200)
    timeout2('Por tu garganta muchos han matado', 42500)

    timeout2('Nadie te puede tachar de sobrado', 44200)
    timeout2('Eres lo más puro que yo he presenciado', 46500)
    timeout2('Si no te da pa\' comprarte un tejado', 48700)
    timeout2('Yo en nuestro banco te invito un helado', 50800)

    timeout2('Pa\' recordarte que nada ha cambiado', 54000)
    timeout2('Que sigues siendo mi hermano, sabes que en mi mesa no falta tu plato', 57000)
    timeout2('Y que a mi perro le encanta tu gato', 61500)
    timeout2('Y que si se gasta tu suela, sabes de sobra que tienes mi zapato', 65700)

    timeout2('Soy tu colega', 70500)
    timeout2('Cuando mueren las risas, dime, ¿quién se queda?', 72000)
    timeout2('Y no lo hace pa\' llamar tu atención', 75200)

    timeout2('Soy tu colega', 79500)
    timeout2('Cuando todo son prisas, dime, ¿quién se frena?', 81200)
    timeout2('Porque se te ha desatado un cordón', 84500)

    timeout2('Soy tu colega', 86700)
    timeout2('Cuando cambia la brisa, solo veo veletas', 89700)
    timeout2('Se arriman al calor que da tu sol', 93500)

    timeout2('Soy tu colega', 96000)
    timeout2('¿Por cuántos pones la mano y nunca te quemas?', 98200)
    timeout2('Los pocos que no han proba\'o tu rencor', 102000)

    timeout2('Soy tu colega', 105000)
    timeout2('Queriendo nombrarte hasta aquí, en la pecera', 107000)
    timeout2('Mis grises han pillado tu color', 110000)

    timeout2('Soy tu colega', 113500)
    timeout2('Me la suda si hay ocho, que si hay ochenta', 115800)
    timeout2('Prometo corearte la canción...', 119700)
    timeout2('Prometo corearte la canción', 123500)

    timeout2('Nene, recuerda cuando pises el escenario', 130000)
    timeout2('Que estás pisando por todos aquellos', 132500)
    timeout2('Que se inundan a diario', 135000)
    timeout2('Vomitan en folios su desasosiego', 137200)

    timeout2('Ahogados en copas, tricomas y labios', 139700)
    timeout2('Mezclando el ron con las penas de antaño', 141200)
    timeout2('Mueven el alma que habita en los barrios', 143000)
    timeout2('Jarabe para el body, fruto del desgarro', 145000)

    timeout2('Tan enamorada de tus ojos sabios', 148500)
    timeout2('De tus cimientos y de tus peldaños', 150500)
    timeout2('De lo poquito que duele a tu lado', 152400)
    timeout2('No estar en paz con mi puto pasado', 154600)

    timeout2('Sé que a tu verita, nada está cambiado', 157200)
    timeout2('Hasta la médula siempre has calado', 159000)
    timeout2('Si no te da pa\' comprarte un tejado', 161500)
    timeout2('Yo en nuestro banco te invito un helado', 163800)

    timeout2('Pa\' recordarte que nada ha cambiado', 166700)
    timeout2('Que sigues siendo mi hermano, sabes que en mi mesa no falta tu plato', 170000)
    timeout2('Y que a mi perro le encanta tu gato', 174000)
    timeout2('Y que si se gasta tu suela, sabes de sobra que tienes mi zapato', 178000)

    timeout2('Soy tu colega', 183000)
    timeout2('Cuando mueren las risas, dime, ¿quién se queda?', 184200)
    timeout2('Y no lo hace pa\' llamar tu atención', 188000)

    timeout2('Soy tu colega', 191200)
    timeout2('Cuando todo son prisas, dime, ¿quién se frena?', 193700)
    timeout2('Porque se te ha desatado un cordón', 197000)

    timeout2('Soy tu colega', 200000)
    timeout2('Cuando cambia la brisa, solo veo veletas', 202500)
    timeout2('Se arriman al calor que da tu sol', 205700)

    timeout2('Soy tu colega', 208700)
    timeout2('¿Por cuántos pones la mano y nunca te quemas?', 210700)
    timeout2('Los pocos que no han proba\'o tu rencor', 214500)

    timeout2('Soy tu colega', 217000)
    timeout2('Queriendo nombrarte hasta aquí, en la pecera', 219500)
    timeout2('Mis grises han pillado tu color', 222700)

    timeout2('Soy tu colega', 226000)
    timeout2('Me la suda si hay ocho, que si hay ochenta', 228500)
    timeout2('Prometo corearte la canción...', 231800)
    timeout2('Prometo corearte la canción', 236300)
}
function illBreakMyHeartAgain() {
    cancionEspecial = true;
    timeout2('You only know what you lost', 8000)
    timeout2('When you try and replace it', 10700)
    timeout2('Tryin\' to find a quick fix', 16500)
    timeout2('\'Cause you can\'t take the pain in', 18500)
    timeout2('And every time I close my eyes, I kiss him', 24200)
    timeout2('Every time I feel his hands on my skin', 28500)
    timeout2('I, I wish it was you', 32400)

    timeout2('Being with somebody helps', 39600)
    timeout2('But if I\'m honest with myself', 43400)

    timeout2('I\'ll break my heart again', 48500)
    timeout2('Until you miss the end', 56600)
    timeout2('If you change your mind', 63700)
    timeout2('And take me back', 65700)
    timeout2('For just one day, oh, all we had', 67800)
    timeout2('I\'ll break my heart again', 72700)

    timeout2('He shows me how he feels', 81000)
    timeout2('But I just can\'t feel the same', 82800)
    timeout2('\'Cause all he\'s ever been is a body to fill the spaces', 89300)
    timeout2('Can\'t tell him he\'s the wrong man at the right time', 96990)
    timeout2('Better that I keep my feelings inside', 101300)
    timeout2('I, I wish it was you', 105700)

    timeout2('Being with somebody helps', 112700)
    timeout2('But if I\'m honest with myself', 116700)

    timeout2('I\'ll break my heart again', 121700)
    timeout2('Until you miss the end', 129700)
    timeout2('If you change your mind', 136800)
    timeout2('And take me back', 139000)
    timeout2('For just one day, oh, all we had', 140900)
    timeout2('I\ll break my heart again', 145990)

    timeout2('💔🩹💔🩹💔🩹💔', 153000)

    timeout2('Being with somebody helps', 169800)
    timeout2('But if I\'m honest with myself', 173500)

    timeout2('I\'ll break my heart again', 178400)
    timeout2('Until you miss the end', 186700)
    timeout2('If you change your mind', 193700)
    timeout2('And take me back', 196000)
    timeout2('For just one day, oh, all we had', 198000)
    timeout2('I\'ll break my heart again', 202900)
}
function champion() {
    cancionEspecial = true;
    timeout2('Late nights on your pillow', 800)
    timeout2('Love as fast as light', 4800)
    timeout2('Faded into echoes', 8500)
    timeout2('In my ventricles', 12500)
    timeout2('I carry this cargo', 16400)
    timeout2('Sinking deeper down', 20500)
    timeout2('And though your love was shallow', 24300)
    timeout2('I managed to drown', 28600)

    timeout2('Is this how you\'re gonna make me look now', 32300)
    timeout2('Is this how you\'re gonna walk right out', 36300)
    timeout2('Then you\'d better do it like a champion', 40300)
    timeout2('And break my heart once and for all', 44300)
    timeout2('Do you feel good knowing that you\'ve won now', 48300)
    timeout2('Do you get high when I hit my lows', 52300)
    timeout2('Yeah I hope you feel like you\'re a champion', 56300)
    timeout2('When you break my heart once and for all', 60500)

    timeout2('I keep bending barrels', 64500)
    timeout2('You take aim and shoot', 68500)
    timeout2('I\'m on pins and needles', 72500)
    timeout2('Your skin\'s bulletproof', 76500)
    timeout2('Don\'t try to be noble', 80500)
    timeout2('Leaving me for dead', 84400)
    timeout2('And though your love is hollow', 88200)
    timeout2('I could use your hand', 92300)

    timeout2('Is this how you\'re gonna make me look now', 96200)
    timeout2('Is this how you\'re gonna walk right out', 100300)
    timeout2('Then you\'d better do it like a champion', 104300)
    timeout2('And break my heart once and for all', 108200)
    timeout2('Do you feel good knowing that you\'ve won now', 112100)
    timeout2('Do you get high when I hit my lows', 116300)
    timeout2('Yeah I hope you feel like you\'re a champion', 120200)
    timeout2('When you break my heart once and for all', 124200)

    timeout2('💔', 128200)

    timeout2('Just break my heart once and for all', 140300)
    timeout2('Do you feel good knowing that you\'ve won now', 144300)
    timeout2('Do you get high when I hit my lows', 148300)
    timeout2('Yeah I hope you feel like you\'re a champion', 152300)
    timeout2('When you break my heart once and for all', 156300)
    timeout2('Yeah I hope you feel like you\'re a champion', 160300)
    timeout2('When you break my heart once and for all', 164300)
}

function roundRect(ctx, x, y, width, height, radius = 5, fill, stroke = true, sinBordesArriba = false) {
    var r2;
    sinBordesArriba ? r2 = 0 : r2 = radius;
    ctx.beginPath();
    ctx.moveTo(x + r2, y);
    ctx.lineTo(x + width - r2, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r2);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + r2);
    ctx.quadraticCurveTo(x, y, x + r2, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
async function cambiarEstadoConMensaje() {
    const message = await client.channels.cache.get('849733450671718432').messages.fetch('849734239305334834')
    function msg(c = 0, f = 1, same = false) {
        var content = message.content.replace(/\s+/g, ' ').trim();
        if (same) {
            return content.split(' ').slice(c, f).join(' ');
        }
        else {
            return content.split(' ').slice(c, f).join(' ').toLowerCase();
        }
    }
    var tipo;
    const mensaje = msg(0, 1000).replace('-p ', '').replace('-s ', '').replace('-w ', '').replace('-c ', '').replace('-l ', '').replace('-dnd ', '').replace('-inv ', '').replace('-idl ', '')
    if (msg(0, 100).match('-p')) {
        tipo = 'PLAYING';
    } else if (msg(0, 100).match('-s')) {
        client.user.setActivity(mensaje, {
            type: 'STREAMING',
            url: 'https://www.twitch.tv/fiuva2'
        })
        return;
    } else if (msg(0, 100).match('-w')) {
        tipo = 'WATCHING';
    } else if (msg(0, 100).match('-c')) {
        tipo = 'COMPETING';
    } else if (msg(0, 100).match('-l')) {
        tipo = 'LISTENING';
    } else {
        tipo = 'CUSTOM_STATUS';
        message.channel.send('!estado <-p, -c, -l, -w, -s>')
        return;
    }
    var status;
    if (msg(0, 100).match('-dnd')) {
        status = 'dnd';
    } else if (msg(0, 100).match('-inv')) {
        status = 'invisible';
    } else if (msg(0, 100).match('-idl')) {
        status = 'idle';
    } else {
        status = 'online';
    }
    client.user.setPresence({
        status: status,
        activity: {
            name: mensaje,
            type: tipo,
        }
    })
}

async function modificarMonedas(id, sumar) {
    var user = await Usuario.find({ idDiscord: id }).exec();
    await Usuario.findOneAndUpdate({ idDiscord: id }, { monedas: user[0].monedas + sumar }, { new: true });
}

function cargar(message) {
    const platypus1 = client.emojis.cache.find(emoji => emoji.name === "platypus1");
    const platypus2 = client.emojis.cache.find(emoji => emoji.name === "platypus2");
    const platypusEnfadado = client.emojis.cache.find(emoji => emoji.name === "platypusEnfadado");

    message.channel.send(`${platypus1}${platypus2}         👈`).then(message2 => {
        var func = function (i) {

            return function () {
                if (i >= 6) return message2.edit(`${platypusEnfadado}`);
                if (message.deleted) {
                    return message2.delete();
                }
                if (i % 2 != 0) {
                    message2.edit(`${platypus1}${platypus2}👈`)
                } else {
                    message2.edit(`${platypus1}${platypus2}         👈`)
                }
                setTimeout(func(++i), 1200);
            }
        }
        setTimeout(func(1), 100);
    })

}

function arreglarTitulo(titulo) {
    var tituloCompleto = titulo;
    var tituloFix = '';
    var parentesis = false;
    for (iletra = 0; iletra < tituloCompleto.length; iletra++) {
        if (tituloCompleto[iletra] == '(' || tituloCompleto[iletra] == '[') {
            parentesis = true;
            break;
        } else if (tituloCompleto[iletra] == ')' || tituloCompleto[iletra] == ']') {
            parentesis = false;
        }
        if (!parentesis) {
            tituloFix = tituloFix + tituloCompleto[iletra];
        }
    }
    tituloFix = tituloFix
        .replace(/videoclip/i, '')
        .replace(/|/g, '')
        .replace(/-/g, '')
        .replace(/"/g, '')
        .replace(/M\/V/gi, '')
        .replace(/Lyrics/gi, '')
        .replace(/letra/gi, '')
    return tituloFix
}