const { AUMENTA_NIVEL, CONFIG, AUMENTAR_MONEDAS_NIVEL } = require("../config/constantes");
const Usuario = require("../models/usuario");
const { ActivityType, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");
const { ButtonStyle } = require("../node_modules/discord-api-types/v10");

module.exports = {
    msg,
    calcularNivel,
    roundRect,
    cambiarEstadoConMensaje,
    subirExperiencia,
    reenviarMensajeTo,
    calcularTiempoToAdd,
    calcularPrecioVenta,
    findOrCreateDocument,
    random,
    modificarMonedas,
    sleep,
    deepEqual,
    getMentionOrUser,
    createRegaloRandom,
    shuffle
}
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function random(array) {
    return array[Math.random() * array.length << 0];
}

function msg(message, c = 0, f = 1, same = false) {
    var content = message.content.replace(/\s+/g, ' ').trim();
    if (same) {
        return content.split(' ').slice(c, f).join(' ');
    }
    else {
        return content.split(' ').slice(c, f).join(' ').toLowerCase();
    }
}

function calcularNivel(experienciaTotal) {
    var expActual = experienciaTotal;
    var nivel = 0;
    var calcularExp = 0;
    var calcularExpAnterior;
    for (nivel; calcularExp < expActual + 1; nivel++) {
        if (nivel <= 17) {
            calcularExp = calcularExp + (nivel + 1) * AUMENTA_NIVEL;
        } else {
            calcularExp = calcularExp + (nivel + 17) + AUMENTA_NIVEL * 17;
        }
        if (calcularExp < expActual + 1) calcularExpAnterior = calcularExp;
    }
    nivel--;
    return [nivel, calcularExp, calcularExpAnterior];
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

async function cambiarEstadoConMensaje(client) {
    const message = await client.channels.cache.get(CONFIG.CANAL_CONFIG).messages.fetch(CONFIG.MENSAJE_ESTADO)
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
    const mensaje = msg(0, 1000).replace('-p ', '').replace('-s ', '').replace('-w ', '').replace('-c ', '').replace('-l ', '').replace('-dnd ', '').replace('-inv ', '').replace('-idl ', '');
    if (msg(0, 100).match('-p')) {
        tipo = ActivityType.Playing;
    } else if (msg(0, 100).match('-s')) {
        client.user.setActivity(mensaje, {
            type: ActivityType.Streaming,
            url: 'https://www.twitch.tv/fiuva2'
        })
        return;
    } else if (msg(0, 100).match('-w')) {
        tipo = ActivityType.Watching;
    } else if (msg(0, 100).match('-c')) {
        tipo = ActivityType.Competing;
    } else if (msg(0, 100).match('-l')) {
        tipo = ActivityType.Listening;
    } else {
        tipo = ActivityType.Custom;
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
    client.user.setPresence({ activities: [{ name: mensaje, type: tipo }], status: status });
}

async function findOrCreateDocument(id, Modelo) {
    let user = (await Modelo.find({ idDiscord: id }))[0];
    if (!user) user = await new Modelo({ idDiscord: id }).save();
    return user;
}

async function subirExperiencia(message) {
    try {
        var user = await Usuario.find({ idDiscord: message.author.id }).exec();
        var lim = user[0].expTotal;
        const calcularNivelConst = calcularNivel(lim - 1);
        var nivel = calcularNivelConst[0] + 1;
        var calcularExp = calcularNivelConst[1];

        await Usuario.findOneAndUpdate({ idDiscord: message.author.id }, { expTotal: user[0].expTotal + 1 }, { new: true });
        if (user[0].expTotal + 1 == calcularExp) {
            modificarMonedas(message.author.id, AUMENTAR_MONEDAS_NIVEL);
            var embed = new EmbedBuilder();
            var rol;
            switch (nivel) {
                case 2:
                    rol = message.guild.roles.cache.get('836941894474268763');
                    message.member.roles.add(rol);
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres una Hez (el singular de heces)`);
                    embed.setColor(rol.hexColor);
                    break;
                case 5:
                    rol = message.guild.roles.cache.get('836946522293272596');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836941894474268763'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres una Piña normal`);
                    embed.setColor(rol.hexColor);
                    break;
                case 10:
                    rol = message.guild.roles.cache.get('836946511199207435');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946522293272596'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Lechuzo Lloroso :'<`);
                    embed.setColor(rol.hexColor);
                    break;
                case 20:
                    rol = message.guild.roles.cache.get('836946476647186499');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946511199207435'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Cerdo Rotatorio`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 40);
                    break;
                case 30:
                    rol = message.guild.roles.cache.get('836946505490366514');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946476647186499'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Lechuzo Inverso :>`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 60);
                    break;
                case 40:
                    rol = message.guild.roles.cache.get('836946499023142992');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946505490366514'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Mamífero Ovíparo`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 100);
                    break;
                case 50:
                    rol = message.guild.roles.cache.get('836946491733573662');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946499023142992'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Ornitorrinco Venenso`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 100);
                    break;
                case 60:
                    rol = message.guild.roles.cache.get('836946484376502282');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946491733573662'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres una Nutria Sudorosa <3`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 150);
                    break;
                case 70:
                    rol = message.guild.roles.cache.get('836946467469918269');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946484376502282'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Castor con sabor a vainilla`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 250);
                    break;
                case 80:
                    rol = message.guild.roles.cache.get('836946433806041138');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946467469918269'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Roedor Profesional`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 500);
                    break;
                case 90:
                    rol = message.guild.roles.cache.get('836946423139794955');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946433806041138'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres un Castor Sudoroso`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 750);
                    break;
                case 100:
                    rol = message.guild.roles.cache.get('836946407725334548');
                    message.member.roles.add(rol);
                    message.member.roles.remove(message.guild.roles.cache.get('836946423139794955'));
                    embed.setDescription(`Felicidades! ${message.author}, ahora eres una Ornitorrinca Lechosa 🤤`);
                    embed.setColor(rol.hexColor);
                    modificarMonedas(message.author.id, 1000);
                    break;
                default:
                    embed.setDescription(`Felicidades! ${message.author}, has subido a nivel ${nivel}`);
                    embed.setColor("#A1F975");
                    break;
            }
            message.channel.send({ embeds: [embed] });
        }
    } catch {
        await new Usuario({ idDiscord: message.author.id, expTotal: 0 }).save();
    }

}

async function modificarMonedas(id, sumar, user = null, navidad = false) {
    if (!user) user = await findOrCreateDocument(id, Usuario);
    if (navidad)
        await Usuario.findOneAndUpdate({ idDiscord: id }, { pavos: user.pavos + sumar });
    else
        await Usuario.findOneAndUpdate({ idDiscord: id }, { monedas: user.monedas + sumar });
}

async function reenviarMensajeTo(msg, canal, refDelAutor = false) {
    await canal.send({
        content: `${refDelAutor ? `${msg.author}: ` : ''}${msg.content.length == 0 ? ' ' : msg.content}`,
        files: Array.from(msg.attachments.values())
    });
}

function calcularTiempoToAdd(date, fecha) {
    const fecha1 = new Date(fecha)
    var t = (date - fecha1);
    if (t == date.getTime()) {
        t = 0;
        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
    }
    return t;
}

function calcularPrecioVenta(precioCompra) {
    return Math.floor(precioCompra * (1 - 0.15));
}

function deepEqual(object1, object2) {
    if (!object1 || !object2)
        if (object1 == object2) return true;
        else return false;
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}
function isObject(object) {
    return object != null && typeof object === 'object';
}
function getMentionOrUser(message) {
    return message.mentions.users.first() || message.author;
}

Object.defineProperties(Array.prototype, {
    count: {
        value: function (value) {
            return this.filter(x => x == value).length;
        }
    }
});
function createRegaloRandom() {
    const emotes = {
        ornitorrinco: [
            "<:rechazado:1011314869691228241>",
            "<:platypusTarde:839396747008147487>",
            "<:platypusSaludo:839394513653858335>",
            "<:platypusRefachero:839042641945559051>",
            "<:platypusOro:839396299517853747>",
            "<:platypusNinja:839396877966639104>",
            "<:platypusLloroso:839396511833653268>",
            "<:platypusHambre:839397013623668756>",
            "<:platypusEnfadado:839397136235364393>",
            "<:platypusDudosoJesus:847563489521696788>",
            "<:platypus1:839393604867063848><:platypus2:839393726610538506>",
            "<:platypusPaulita:903974367468331038>",
            "<:baboso:1047514787065626724>",
            "<:platypusHez1:840339984128409602><:platypusHez2:840340006249037865>"
        ],
        getRandom(min = 1, max = 1) {
            return getMultipleRandom(this.ornitorrinco, (Math.random() * (max - min) << 0) + min)
        }
    }
    const emoteElegido = emotes.getRandom()[0];
    const emotesRandom = emotes.getRandom(20, 75);
    const premio = (Math.random() * 1000 << 0) + 100;
    let regalo = new EmbedBuilder()
        .setColor("#EBEF45")
        .setTitle('¡Has encontrado un regalo!')
        .setAuthor({ name: "Regalo", iconURL: "https://images.emojiterra.com/google/noto-emoji/v2.034/512px/1f381.png" })
        .setDescription(emotesRandom.join(' ') + `\n\n**Cuántos ${emoteElegido} ves?**`)

    const numGanador = emotesRandom.count(emoteElegido);
    let posibles = [...Array(6).keys()].filter(a => a != numGanador);
    posibles = shuffle(posibles);

    let botones = [
        new ButtonBuilder()
            .setLabel(numGanador.toString())
            .setCustomId(`regalo_navidad_sum_${premio}`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel(posibles[0].toString())
            .setCustomId(`regalo_navidad_perdido_1`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel(posibles[1].toString())
            .setCustomId(`regalo_navidad_perdido_2`)
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setLabel(posibles[2].toString())
            .setCustomId(`regalo_navidad_perdido_3`)
            .setStyle(ButtonStyle.Secondary)
    ]
    botones = shuffle(botones);
    var rowBotones = new ActionRowBuilder()
        .addComponents(botones[0], botones[1], botones[2], botones[3])

    return [regalo, rowBotones]

    function getMultipleRandom(arr, num) {
        let res = [];
        let l = arr.length
        for (var i = 0; i < num; i++)
            res.push(arr[Math.random() * l << 0]);
        return res;
    }
}
